import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-company-type',
  templateUrl: './company-type.component.html',
  styleUrls: ['./company-type.component.css']
})
export class CompanyTypeComponent implements OnInit {
  public paramsToTableData: any;
  public companyTypeForm: FormGroup;

  public title: string;

  /*update properties on change start*/
  paramToSearch: any;
  submitToCreate: boolean;
  submitToUpdate: boolean;
  submitButton: string;
  /*update properties on change end*/

  /*selects start*/
  languages: any;
  /*selects end*/

  constructor(
    private crud: CrudService,
    public matsnackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.companyTypeInit();

    /*selects start*/
    let paramsToSelectLanguage = {
      route: "languages"
    }
    this.crud.read(paramsToSelectLanguage)
    .then(res => {
      this.languages = res;
    })
    /*selects end*/

    this.companyTypeForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'languageSetting': new FormControl(null, Validators.required)
    })

    this.makeList();
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de empresas",
        delete: [{
          routeAfterDelete: '/main/company-type',
          routeToApi: 'companyTypes',
          fieldToDelete: '__key'
        }],
        search: true
      },
      list: {
        route: "companyTypes",
        show: ['name', 'description', 'languageSetting'],
        header: ['Nome', 'Descrição', 'Língua'],
        order: ['languageSetting', 'desc'],
        edit: {route: '/main/company-type/', param: '__key'},
        page: 1
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  companyTypeInit = () => {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar tipo de companhia";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

        this.crud.read({
          route: 'companyTypes/'+param,
          page: 1
        }).then(res => {
          this.companyTypeForm.patchValue(res);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Novo tipo de companhia";
        this.submitButton = "Salvar";
      }
    })
  }

  onCompanyTypeFormSubmit = () => {
    if(this.submitToUpdate) {
      let params = {
        route: 'companyTypes',
        objectToUpdate: this.companyTypeForm.value,
        paramToUpdate: this.paramToSearch.replace(':', '')
      };
  
      this.crud.update(params)
      .then(res => {
        this.matsnackbar.open(res['message'], '', {
          duration: 2000
        })
      }, rej => {
        this.matsnackbar.open(rej['message'], '', {
          duration: 3000
        })
      })
  
      this.makeList();
      
      this.router.navigate(['/main/company-type']);
    } else if(this.submitToCreate) {
      let params = {
        route: 'companyTypes',
        objectToCreate: this.companyTypeForm.value
      };

      this.crud.create(params)
      .then(res => {
        this.matsnackbar.open(res['message'], '', {
          duration: 2000
        })
      }, rej => {
        this.matsnackbar.open(rej['message'], '', {
          duration: 3000
        })
      })

      this.companyTypeForm.patchValue(this.companyTypeForm.value);

      this.makeList();
    } else {
      console.log("No action defined on submit");
    }
  }
}
