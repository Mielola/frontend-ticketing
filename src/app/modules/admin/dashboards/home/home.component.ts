import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { User } from 'app/core/user/user.types';
import { ProjectService } from 'app/modules/admin/dashboards/home/home.service';
import { data } from 'app/modules/component/card/area-chart/data';
import { ApiService } from 'app/services/api.service';
import { UserService } from 'app/services/userService/user.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexFill
} from "ng-apexcharts";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';


interface Sumarry {
    pending_tickets: number,
    open_tickets: number
    resolved_tickets: number
    total_tickets: number
}

interface Ticket {
    category: number;
    created_at: string;
    detail_kendala: string;
    due_date: string | null;
    hari_masuk: string;
    hari_respon: string;
    id: number;
    owner: string;
    priority: "low" | "medium" | "high";
    respon_diberikan: string;
    status: "New" | "In Progress" | "Resolved" | "Closed";
    subject: string;
    time_worked: string | null;
    tracking_id: string;
    updated_at: string;
    user_email: string;
    user_name: string;
    waktu_masuk: string;
    waktu_respon: string;
}

interface UserLogs {
    id: number;
    email: string;
    name: string;
    role: string;
    shift_name: string | null;
    avatar: string;
    status: string;
    login_date: string;
    login_time: string;
}



@Component({
    selector: 'project',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        TranslocoModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatMenuModule,
        MatTabsModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        MatTableModule,
        NgClass,
        CurrencyPipe,
        CommonModule,
        MatPaginatorModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSortModule,
    ],
})
export class ProjectComponent implements OnInit, OnDestroy {
    user: User;
    selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<UserLogs>();
    summary: Sumarry
    recent_tickets: Ticket[] = []
    chartGithubIssues: ApexOptions = {};
    data: any;
    isLoading : boolean = false

    // Table
    private displayedColumns = ['name', 'role', 'shift', 'login_date', 'login_time'];
    private dataSource = new MatTableDataSource<any>();

    // Paginator
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    /**
     * Constructor
     */
    constructor(
        private _projectService: ProjectService,
        private _router: Router,
        private _userService: UserService,
        private _apiService: ApiService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._projectService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;
                console.log(data)
                this._prepareChartData();
            });

        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((users) => {
            this.user = users
        })

        this.fetchData()
    }

    /**
     * After View Init
     */

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public Methods
    // -----------------------------------------------------------------------------------------------------

    async fetchData() {
        try {
            this.isLoading = true
            const dataTickets = await this._apiService.get("api/V1/dashboard")
            
            // Summary Tickets
            this.summary = dataTickets.data.summary

            // Recent Tickets
            this.recent_tickets = dataTickets.data.recent_tickets
            
            // Users Logs
            this.dataSource.data = dataTickets.data.user_logs
            console.log(this.dataSource.data)
            
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false
        }
    }

    _prepareChartData() {
        this.chartGithubIssues = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#64748B', '#94A3B8'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0,
                },
            },
            grid: {
                borderColor: 'var(--fuse-border)',
            },
            labels: this.data.githubIssues.labels,
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: this.data.githubIssues.series,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: [3, 0],
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: 'var(--fuse-border)',
                },
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };
    }



}
