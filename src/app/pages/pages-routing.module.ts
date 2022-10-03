import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        data: { pageTitle: 'Home' }
    }
];

export const pageRouting = RouterModule.forChild(routes);
