import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableContactComponent } from './selectable-contact.component';

describe('SelectableContactComponent', () => {
  let component: SelectableContactComponent;
  let fixture: ComponentFixture<SelectableContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectableContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectableContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
