import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardForm: FormGroup;
  paramsToTableData: any;
  statusSelect: any;
  title: string;
  people: any = [{
    description: "Ryzzan",
    value: "Ryzzan"
  }, {
    description: "Danilo",
    value: "Danilo"
  }, {
    description: "Victor",
    value: "Victor"
  }]

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

  /**
   * Cycle hook actions start
   */
  ngOnInit() {
    this.statusSelect = ["To-Do", "Problems", "Done"];
    
    this.dashboardInit();

    this.dashboardForm = new FormGroup({
      'description': new FormControl(null, Validators.required),
      'status': new FormControl(null, Validators.required),
      'person': new FormControl(null)
    })

    this.makeList();
  }
  /**
   * Cycle hook actions end
   */

  dashboardInit = () => {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar tarefa";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

        this.crud.read({
          route: 'bonamondoTasks/'+param,
          page: 1
        }).then(res => {
          this.dashboardForm.patchValue(res);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Atualizar tarefa";
        this.submitButton = "Salvar";
      }
    })
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de tarefas",
        delete: [{
          routeAfterDelete: '/main/dashboard',
          routeToApi: 'bonamondoTasks',
          fieldToDelete: '__key'
        }],
        search: true
      },
      list: {
        route: "bonamondoTasks",
        show: ['description', 'status'],
        header: ['Descrição', 'Status'],
        order: ['description', 'desc'],
        edit: {route: '/main/dashboard/', param: '__key'},
        page: 1
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  onDashboardFormSubmit = () => {
    if(this.submitToUpdate) {
      let params = {
        route: 'bonamondoTasks',
        objectToUpdate: this.dashboardForm.value,
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
      
      this.router.navigate(['/main/dashboard']);
    } else if(this.submitToCreate) {
      let params = {
        route: 'bonamondoTasks',
        objectToCreate: this.dashboardForm.value
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

      this.dashboardForm.patchValue(this.dashboardForm.value);

      this.makeList();
    } else {
      console.log("No action defined on submit");
    }
  }
}
