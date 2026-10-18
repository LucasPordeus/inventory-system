# 09 — Guia: novo módulo (CRUD) no back-end

Exemplo com um recurso fictício `categories`. Troque os nomes conforme o módulo. Os modelos de referência reais são `product*`, `supplier*` e `movement*`.

## Checklist

1. [ ] Migration `NNN_create_<recurso>.sql` (+ seed opcional)
2. [ ] Repository
3. [ ] Service
4. [ ] Controller
5. [ ] Schemas Joi em `validationSchemas.js`
6. [ ] Arquivo de rotas
7. [ ] Registrar em `routes/index.js`
8. [ ] Documentar em `config/swagger.js`
9. [ ] Se for uma tela nova: inserir em `screens` via migration
10. [ ] Atualizar `backend/api.md` e `backend/banco-de-dados.md`

## 1. Migration — `src/database/migrations/NNN_create_categories.sql`

```sql
CREATE TABLE IF NOT EXISTS categories (
    category_id   SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL UNIQUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Use o próximo número livre em **todas** as branches (ver `backend/banco-de-dados.md`). Precisa ser idempotente.

## 2. Repository — `src/repositories/categoryRepository.js`

```js
const { query } = require('../config/database');

class CategoryRepository {
  async create({ name }) {
    const sql = `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING category_id, name
    `;
    const { rows } = await query(sql, [name]);
    return rows[0];
  }

  async findById(categoryId) {
    const sql = `
      SELECT category_id, name
      FROM categories
      WHERE category_id = $1
    `;
    const { rows } = await query(sql, [categoryId]);
    return rows[0] || null;
  }

  async findAll() {
    const sql = `
      SELECT category_id, name
      FROM categories
      ORDER BY category_id ASC
    `;
    const { rows } = await query(sql);
    return rows;
  }

  async update(categoryId, { name }) {
    const sql = `
      UPDATE categories
         SET name       = COALESCE($2, name),
             updated_at = NOW()
       WHERE category_id = $1
       RETURNING category_id, name
    `;
    const { rows } = await query(sql, [categoryId, name]);
    return rows[0] || null;
  }

  async delete(categoryId) {
    const sql = `DELETE FROM categories WHERE category_id = $1`;
    const result = await query(sql, [categoryId]);
    return result.rowCount > 0;
  }
}

module.exports = new CategoryRepository();
```

## 3. Service — `src/services/categoryService.js`

```js
const categoryRepository = require('../repositories/categoryRepository');
const AppError = require('../errors/appError');

class CategoryService {
  async createCategory(payload) {
    return categoryRepository.create(payload);
  }

  async getCategoryById(categoryId) {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async listCategories() {
    return categoryRepository.findAll();
  }

  async updateCategory(categoryId, payload) {
    const updated = await categoryRepository.update(categoryId, payload);
    if (!updated) {
      throw new AppError('Category not found', 404);
    }
    return updated;
  }

  async deleteCategory(categoryId) {
    const deleted = await categoryRepository.delete(categoryId);
    if (!deleted) {
      throw new AppError('Category not found', 404);
    }
  }
}

module.exports = new CategoryService();
```

Regras de negócio (duplicidade → 409, entidade relacionada inexistente → 404) ficam aqui.

## 4. Controller — `src/controllers/categoryController.js`

```js
const categoryService = require('../services/categoryService');

class CategoryController {
  async create(req, res) {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json(category);
  }

  async list(_req, res) {
    const categories = await categoryService.listCategories();
    return res.status(200).json(categories);
  }

  async getById(req, res) {
    const categoryId = Number(req.params.id);
    const category = await categoryService.getCategoryById(categoryId);
    return res.status(200).json(category);
  }

  async update(req, res) {
    const categoryId = Number(req.params.id);
    const updated = await categoryService.updateCategory(categoryId, req.body);
    return res.status(200).json(updated);
  }

  async remove(req, res) {
    const categoryId = Number(req.params.id);
    await categoryService.deleteCategory(categoryId);
    return res.status(204).send();
  }
}

module.exports = new CategoryController();
```

Sem `try/catch`.

## 5. Schemas — `src/middlewares/validationSchemas.js`

```js
const createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required()
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(100)
}).min(1);

module.exports = {
  // ...existentes,
  createCategorySchema,
  updateCategorySchema
};
```

## 6. Rotas — `src/routes/categoryRoutes.js`

```js
const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const validationMiddleware = require('../middlewares/validationMiddleware');
const {
  createCategorySchema,
  updateCategorySchema
} = require('../middlewares/validationSchemas');

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler((req, res) => categoryController.list(req, res)));
router.get('/:id', asyncHandler((req, res) => categoryController.getById(req, res)));

router.post(
  '/',
  validationMiddleware(createCategorySchema),
  asyncHandler((req, res) => categoryController.create(req, res))
);

router.put(
  '/:id',
  validationMiddleware(updateCategorySchema),
  asyncHandler((req, res) => categoryController.update(req, res))
);

router.delete('/:id', asyncHandler((req, res) => categoryController.remove(req, res)));

module.exports = router;
```

Para restringir a admin, adicione `adminMiddleware` antes do `validationMiddleware`.

## 7. Registrar — `src/routes/index.js`

```js
const categoryRoutes = require('./categoryRoutes');
// ...
router.use('/categories', categoryRoutes);
```

## 8. Swagger — `src/config/swagger.js`

Adicione a tag, os `paths` (`/categories`, `/categories/{id}`) e os schemas em `components.schemas`, seguindo os blocos de `products`/`suppliers` já existentes, com `security: [{ bearerAuth: [] }]`.

## 9. Transações

Se o service precisar alterar mais de uma tabela de forma atômica (ex.: movimentação que atualiza `products.quantity`), faça no repository com `getClient()` + `BEGIN/COMMIT/ROLLBACK` (modelo: `userScreenRepository.replaceUserScreens`).
