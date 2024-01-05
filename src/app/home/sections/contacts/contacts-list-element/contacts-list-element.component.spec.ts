import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsListElementComponent } from './contacts-list-element.component';

describe('ContactsListElementComponent', () => {
  let component: ContactsListElementComponent;
  let fixture: ComponentFixture<ContactsListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsListElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactsListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
