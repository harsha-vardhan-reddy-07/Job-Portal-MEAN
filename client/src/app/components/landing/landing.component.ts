import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent  implements OnInit{

  authType: string = 'login';
  changeAuthType(type: string){
    this.authType = type;
  }


  username:string = '';
  email: string = '';
  password: string ='';
  usertype: string = '';
  details: {} = {};

  constructor(private http: HttpClient, private route: Router){ }

  ngOnInit(): void {
    
    const userid = localStorage.getItem('userid');
    const userType = localStorage.getItem('usertype');

    if(userid && userType === 'admin'){
      this.route.navigate(['/admin']);
    } else if(userid && userType === 'user'){
      this.route.navigate(['/user']);
    } else if(userid && userType === 'company'){
      this.route.navigate(['/owner']);
    }

  }

  register(){

    this.details = {username: this.username, email: this.email,
                       usertype: this.usertype, password: this.password};
    this.http.post('http://localhost:6001/register', this.details).subscribe(
        (response:any) =>{
          localStorage.setItem('userid', response._id);
          localStorage.setItem('username', response.username);
          localStorage.setItem('email', response.email);
          localStorage.setItem('usertype', response.usertype);
          this.username = '';
          this.email = '';
          this.password='';
          this.usertype = '';

          if (response.usertype === 'user'){
            this.route.navigate(['/user']);
          }else if(response.usertype === 'company'){
            this.route.navigate(['/company']);
          }else if(response.usertype === 'admin'){
            this.route.navigate(['/admin']);
          }
        },
        (error) => {
          console.error(error);
          alert("registration failed");
        }
    )
  }

  login(){
    
    this.details = {email: this.email, password: this.password};
    
    this.http.post('http://localhost:6001/login', this.details).subscribe(
        (response:any) =>{
          localStorage.setItem('userid', response._id);
          localStorage.setItem('username', response.username);
          localStorage.setItem('email', response.email);
          localStorage.setItem('usertype', response.usertype);
          this.username = '';
          this.email = '';
          this.password='';
          this.usertype = '';

          if (response.usertype === 'user'){

            this.route.navigate(['/user']);

          }else if(response.usertype === 'company'){
            this.route.navigate(['/company']);          
          }
          else if(response.usertype === 'admin'){
            this.route.navigate(['/admin']);          
          }
        },
        (error) => {
          console.error(error);
          alert("login failed");
        }
    )
  }

}
