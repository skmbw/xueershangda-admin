import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleEditComponent } from './edit/edit.component';
import { ArticleListComponent } from './list/list.component';

const routes: Routes = [

  { path: 'edit', component: ArticleEditComponent },
  { path: 'list', component: ArticleListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
