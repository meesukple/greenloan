import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  show(alertType:SweetAlertIcon,title:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast',
      },
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: false,
      showCloseButton: true,
    })

    Toast.fire({
    icon: alertType,
    title: title,
  })
  }

  loginSuccess(){
    this.show('success','เข้าสู่ระบบสำเร็จ');
  }
  success(){
    this.show('success','บันทึกเรียบร้อย');
  }
  error(){
    this.show('error','ข้อผิดพลาด');
  }
  incomplete(){
    this.show('error','กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  warning(){
    this.show('warning','แจ้งเตือน');
  }
}
