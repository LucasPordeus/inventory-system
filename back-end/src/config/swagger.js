const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory System API',
    version: '1.0.0',
    description: 'REST API para gerenciamento de estoque'
  },
  servers: [{ url: '/api', description: 'API base' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          user_id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'João Silva' },
          email: { type: 'string', format: 'email', example: 'joao@email.com' },
          role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      Screen: {
        type: 'object',
        properties: {
          screen_id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Dashboard' },
          icon: { type: 'string', example: 'dashboard' },
          redirect: { type: 'string', example: '/dashboard' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Mensagem de erro' }
        }
      }
    },
    responses: {
      Unauthorized: {
        description: 'Token ausente ou inválido',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      NotFound: {
        description: 'Recurso não encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      Conflict: {
        description: 'Conflito — recurso já existe',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      ValidationError: {
        description: 'Dados inválidos',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'API online',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' } }
                }
              }
            }
          }
        }
      }
    },

    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'joao@email.com' },
                  password: { type: 'string', example: 'Senha123' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                    screens: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Screen' }
                    }
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          422: { $ref: '#/components/responses/ValidationError' }
        }
      }
    },

    '/users': {
      post: {
        tags: ['Usuários'],
        summary: 'Criar usuário',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 150, example: 'João Silva' },
                  email: { type: 'string', format: 'email', example: 'joao@email.com' },
                  password: {
                    type: 'string',
                    minLength: 8,
                    description: 'Mínimo 8 caracteres, letra maiúscula, minúscula e número',
                    example: 'Senha123'
                  },
                  role: {
                    type: 'string',
                    enum: ['admin', 'user'],
                    default: 'user',
                    example: 'user'
                  },
                  screenIds: {
                    type: 'array',
                    items: { type: 'integer' },
                    default: [],
                    example: [1, 2]
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário criado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } }
            }
          },
          409: { $ref: '#/components/responses/Conflict' },
          422: { $ref: '#/components/responses/ValidationError' }
        }
      },
      get: {
        tags: ['Usuários'],
        summary: 'Listar usuários',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de usuários',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/User' } }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },

    '/users/me': {
      get: {
        tags: ['Usuários'],
        summary: 'Usuário autenticado + telas',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Dados do usuário logado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    screens: { type: 'array', items: { $ref: '#/components/schemas/Screen' } }
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },

    '/users/{id}': {
      get: {
        tags: ['Usuários'],
        summary: 'Buscar usuário por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: {
            description: 'Usuário encontrado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        tags: ['Usuários'],
        summary: 'Atualizar usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                minProperties: 1,
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 150 },
                  email: { type: 'string', format: 'email' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Usuário atualizado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
          409: { $ref: '#/components/responses/Conflict' },
          422: { $ref: '#/components/responses/ValidationError' }
        }
      },
      delete: {
        tags: ['Usuários'],
        summary: 'Deletar usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          204: { description: 'Usuário deletado' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },

    '/users/{id}/screens': {
      get: {
        tags: ['Usuários'],
        summary: 'Listar telas do usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: {
            description: 'Telas do usuário',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Screen' } }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        tags: ['Usuários'],
        summary: 'Substituir telas do usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['screenIds'],
                properties: {
                  screenIds: { type: 'array', items: { type: 'integer' }, example: [1, 3] }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Telas atualizadas',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Screen' } }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' }
        }
      }
    },

    '/screens': {
      get: {
        tags: ['Telas'],
        summary: 'Listar telas',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de telas',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Screen' } }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      },
      post: {
        tags: ['Telas'],
        summary: 'Criar tela',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'icon', 'redirect'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 150, example: 'Relatórios' },
                  icon: { type: 'string', maxLength: 100, example: 'bar_chart' },
                  redirect: { type: 'string', maxLength: 255, example: '/reports' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Tela criada',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Screen' } }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          409: { $ref: '#/components/responses/Conflict' },
          422: { $ref: '#/components/responses/ValidationError' }
        }
      }
    },

    '/screens/{id}': {
      get: {
        tags: ['Telas'],
        summary: 'Buscar tela por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: {
            description: 'Tela encontrada',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Screen' } }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        tags: ['Telas'],
        summary: 'Atualizar tela',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                minProperties: 1,
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 150 },
                  icon: { type: 'string', maxLength: 100 },
                  redirect: { type: 'string', maxLength: 255 }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Tela atualizada',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Screen' } }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' }
        }
      },
      delete: {
        tags: ['Telas'],
        summary: 'Deletar tela',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          204: { description: 'Tela deletada' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
