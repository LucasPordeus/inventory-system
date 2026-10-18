import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslationSelector } from "./translation-selector";

describe("TranslationSelector", () => {
  let component: TranslationSelector;
  let fixture: ComponentFixture<TranslationSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslationSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
