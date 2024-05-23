import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { ApiService } from './api.service';
import { DepartmentData, AccountData } from './schema';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DropdownModule, ReactiveFormsModule, TableModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'angular';

  departmentData: DepartmentData[] = [];
  onlyDepartment: DepartmentData[] = [];
  accountData: AccountData[] = [];

  cols!: Column[];

  formGroup!: FormGroup;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cols = [
      { field: 'department', header: 'Department' },
      { field: 'account', header: 'Account' },
    ];

    this.formGroup = new FormGroup({
      selectedDepartment: new FormControl<DepartmentData | null>(null),
      selectedAccount: new FormControl(null),
    });

    const params1 = {
      param1: 1088,
      param3: 'DEPT',
      param4: 'ALL',
      // email: '2021ugec078@nitjsr.ac.in',
    };

    this.apiService.getData(params1).subscribe(
      (data) => {
        // console.log('Data received:', data);

        this.departmentData = data.map((item: DepartmentData) => ({
          description: item.description,
          codeKey: item.codeKey,
          orgId: item.orgId,
          codeId: item.codeId,
        }));

        this.onlyDepartment = data.map(
          (item: DepartmentData, index: number) => ({
            id: index,
            codeKey: item.codeKey,
            description: item.description,
          })
        );

        console.log('departmentData', this.departmentData);
        console.log('onlyDepartment', this.onlyDepartment);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

    console.log('this.formGroup 1', this.formGroup);

    this.formGroup
      .get('selectedDepartment')
      ?.valueChanges.subscribe((selectedDepartment) => {
        // console.log('this.formGroup 2', this.formGroup);
        // console.log('selectedDepartmentinside', selectedDepartment);

        const codeKey = selectedDepartment?.codeKey;

        const params2 = {
          param1: 1088,
          param2: 2,
          param3: 'HIG',
          param4: codeKey,
          param5: 'PO',
        };

        console.log('params2', params2);

        this.apiService.getDeptData(params2).subscribe(
          (data) => {
            console.log('data', data);
            this.accountData = data.map((account: any, index: number) => ({
              id: index,
              accName: account.accName,
            }));

            console.log('accountData', this.accountData);
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
      });
  }
}
