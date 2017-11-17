import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {
  public paramsToTableData: any;
  public languageForm: FormGroup;

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
    this.languageInit();

    this.languageForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'initials': new FormControl(null, Validators.required)
    })

    this.makeList();
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de empresas",
        delete: [{
          routeAfterDelete: '/main/language',
          routeToApi: 'languages',
          fieldToDelete: '__key'
        }],
        search: true
      },
      list: {
        route: "languages",
        show: ['name', 'description', 'initials'],
        header: ['Nome', 'Descrição', 'Iniciais'],
        order: ['language', 'desc'],
        edit: {route: '/main/language/', param: '__key'},
        page: 1
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  languageInit = () => {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar língua";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

        this.crud.read({
          route: 'languages/'+param,
          page: 1
        }).then(res => {
          this.languageForm.patchValue(res);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Nova língua";
        this.submitButton = "Salvar";
      }
    })
  }

  onLanguageFormSubmit = () => {
    if(this.submitToUpdate) {
      let params = {
        route: 'languages',
        objectToUpdate: this.languageForm.value,
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
      
      this.router.navigate(['/main/language']);
    } else if(this.submitToCreate) {
      let params = {
        route: 'languages',
        objectToCreate: this.languageForm.value
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

      this.languageForm.patchValue(this.languageForm.value);

      this.makeList();
    } else {
      console.log("No action defined on submit");
    }
  }
}
