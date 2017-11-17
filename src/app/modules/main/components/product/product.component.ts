import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {  
  public paramsToTableData: any;
  public productForm: FormGroup;

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
    this.productInit();

    this.productForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'productTypes': new FormArray([]),
      'model': new FormControl(null),
      'serial': new FormControl(null),
      'dimension': new FormArray([]),
      'maker': new FormArray([]),
      'barcode': new FormControl(null),
      'composition': new FormArray([]), //{ product: string, quantity: number }
      'makerPrice': new FormControl(null)
    })

    this.makeList();
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de produtos",
        delete: [{
          routeAfterDelete: '/main/product',
          routeToApi: 'products',
          fieldToDelete: '__key'
        }],
        search: true
      },
      list: {
        route: "products",
        show: ['name', 'description', 'model'],
        header: ['Nome', 'Descrição', 'Modelo'],
        order: ['__key', 'desc'],
        edit: {route: '/main/product/', param: '__key'},
        page: 1
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  productInit = () => {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar produto";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

        this.crud.read({
          route: 'products/'+param,
          page: 1
        }).then(res => {
          this.productForm.patchValue(res);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Novo produto";
        this.submitButton = "Salvar";
      }
    })
  }
}