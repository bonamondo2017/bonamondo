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
      'more': new FormControl(null)
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
        this.title = "Update Task";
        this.submitButton = "Update";

        let param = this.paramToSearch.replace(':', '');

        this.crud.read({
          route: 'blueprintTasks/'+param,
          page: 1
        }).then(res => {
          this.dashboardForm.patchValue(res);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "New Task";
        this.submitButton = "Save";
      }
    })
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Tasks list",
        delete: [{
          routeAfterDelete: '/main/dashboard',
          routeToApi: 'blueprintTask',
          fieldToDelete: '__key'
        }],
        search: true
      },
      list: {
        route: "blueprintTasks",
        show: ['description', 'status'],
        header: ['Description', 'Status'],
        order: ['description', 'desc'],
        edit: {route: '/main/dashboard/', param: '__key'},
        page: 1,
        changeValue: [{
          field: 'status',
          fieldValue: 'To-Do',
          newValue: 'Por fazer, alterado em params'
        }, {
          field: 'status',
          fieldValue: 'Problems',
          newValue: 'Problemas, alterado em params'
        }]
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  onDashboardFormSubmit = () => {
    if(this.submitToUpdate) {
      let params = {
        route: 'blueprintTasks',
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
        route: 'blueprintTasks',
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
