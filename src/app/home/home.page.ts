import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any[] = [];
  tasksUrgentes: any[] = [];

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController) { 

    let taskJson = localStorage.getItem('taskDb')
    let taskUrgentesJson = localStorage.getItem('taskUrgentesDb')

    if(taskJson != null){
      this.tasks = JSON.parse(taskJson);
    }
    if(taskJson != null){
      this.tasksUrgentes = JSON.parse(taskUrgentesJson);
    }
  }

  async showAdd() {

    const alert = await this.alertCtrl.create({
      header: 'O quê deseja fazer?',
      inputs: [
        {
          name: 'newTask',
          type: 'textarea',
          placeholder: "Digite sua ação..."
        },
        {
          name: 'urgencia',
          type: 'textarea',
          placeholder: "Essa tarefa tem urgência? (s/n)"
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: (form) => {
            console.log(form.newTask);
            let auxTask: string = form.newTask;
            let auxUrgencia: string = form.urgencia;
            this.add(auxTask, auxUrgencia);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("Cancelado!!")
          }
        },
      ]
    });

    await alert.present();
  }

  async add(newTask : string, urgencia: string) {
    //console.log(newTask)
    if (newTask.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Informe o que deseja fazer!',
        duration: 2000,
        position: 'middle'
      });

      toast.present();
      return;
    }
    if (urgencia.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Informe se a tarefa é urgente ou não!',
        duration: 2000,
        position: 'middle'
      });

      toast.present();
      return;
    }

    let task = { name: newTask, urgencia: urgencia, done: false };

    if(urgencia === 's'){
      this.tasksUrgentes.push(task);
    }else{
      this.tasks.push(task);
    }

    this.updateLocalStorage();
  }

  updateLocalStorage(){
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));
    localStorage.setItem('taskUrgentesDb', JSON.stringify(this.tasksUrgentes));
  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'O que deseja fazer?',
      buttons: [{
        text: task.done ? "Desmarcar" : "Marcar",
        icon: task.done ? "radio-button-off" : "checkmark-circle",
        id: 'check-button',
        handler: () => {
          task.done = !task.done;

          this.updateLocalStorage();
        }
      }, 
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  async delete(task: any){

    const alert = await this.alertCtrl.create({
      header: 'Deseja realmente excluir essa tarefa?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            if(task.urgencia === 's'){
              this.tasksUrgentes = this.tasksUrgentes.filter(taskArray=> task != taskArray);
              this.updateLocalStorage();
            }else{
              this.tasks = this.tasks.filter(taskArray=> task != taskArray);
              this.updateLocalStorage();
            }
          }
        },
        {
          text: 'Não',
          cssClass: 'alert-button-cancel',
        },
      ],
    });

    await alert.present();

    //this.updateLocalStorage();
  }

}
