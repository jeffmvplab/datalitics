import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';


export const routes: Routes =  [
  {
    path: '',
    component: LayoutComponent,
    data: { pageTitle: 'Home' },
    children: [
      {
        path: '',
        redirectTo: 'pages/home',
        pathMatch: 'full'
      },
      {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
        data: { pageTitle: 'Pages' }
      }
    ]
  },
];



export const AppRoutingModule = RouterModule.forRoot(routes, {
    useHash: true,
    relativeLinkResolution: 'legacy'
});

/*
export const routing = RouterModule.forRoot(routes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' });
*/



