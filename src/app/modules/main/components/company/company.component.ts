import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  public paramsToTableData: any;
  public companyForm: FormGroup;

  public title: string;

  /*update properties on change start*/
  paramToSearch: any;
  submitToCreate: boolean;
  submitToUpdate: boolean;
  submitButton: string;
  /*update properties on change end*/
  
  constructor(
    private crud: CrudService,
    public matsnackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() { 
    this.companyInit();

    this.companyForm = new FormGroup({
      'tradingName': new FormControl(null, Validators.required),
      'businessName': new FormControl(null),
      'description': new FormControl(null, Validators.required),
      'companyTypes': new FormArray([]), //e.g.: Industry, Trading, Services
      'companyAreas': new FormArray([]), //e.g.: Technology, Telecommunication, Food
      'foundation': new FormArray([]), // {year: number, month: string, day: number}
      'headquarters': new FormArray([]), //{country: string, state: string, city: sring}
    })

    this.makeList();
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de empresas",
        delete: [{
          routeAfterDelete: '/main/company',
          routeToApi: 'companies',
          fieldToDelete: '__key'
        }],
        search: true
      },
      list: {
        route: "companies",
        show: ['name', 'description', 'foundation'],
        header: ['Nome', 'Descrição', 'Fundação'],
        order: ['__key', 'desc'],
        edit: {route: '/main/company/', param: '__key'},
        page: 1
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  companyInit = () => {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar companhia";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

        this.crud.read({
          route: 'companies/'+param,
          page: 1
        }).then(res => {
          this.companyForm.patchValue(res);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Nova companhia";
        this.submitButton = "Salvar";
      }
    })
  }
}
