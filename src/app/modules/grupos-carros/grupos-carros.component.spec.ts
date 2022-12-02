import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposCarrosComponent } from './grupos-carros.component';

describe('GruposCarrosComponent', () => {
  let component: GruposCarrosComponent;
  let fixture: ComponentFixture<GruposCarrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposCarrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposCarrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
