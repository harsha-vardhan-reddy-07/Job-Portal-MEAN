import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  userDisplayContent: string = 'home';

  username: string|null = localStorage.getItem('username');
  userId: string|null = localStorage.getItem('userid');

  jobs: any[] = [];
  applications: any[] = []; 

  displayedjobs: any[] = [];

  bookingDateTime: string = '';

  ngOnInit(): void {
      this.fetchApplications();
      this.fetchJobs();
      this.fetchUserData();
  }

  constructor(private http: HttpClient, private route: Router){}


  userDataName: string = '';
  userDescription: string = '';
  userSkills: string = '';
  userExperience: string = '';
  userResume: string = '';

  // fetch user data

  fetchUserData(){
    this.http.get<any>(`http://localhost:6001/fetch-user-data/${this.userId}`).subscribe(
      (response)=>{
        this.userDataName = response.username;
        this.userDescription = response.description;
        this.userSkills = response.skills;
        this.userExperience = response.experience;
        this.userResume = response.resume;
      
      }
    )
  }


  // update userdata

updateUser(){
  this.http.post<any>('http://localhost:6001/update-user', { userId: this.userId, username: this.userDataName, description: this.userDescription, skills: this.userSkills, experience: this.userExperience, resume: this.userResume}).subscribe(

    (response)=>{
      alert("updated!!");
      this.fetchJobs();
      this.userDisplayContent = 'home';
    }
  ), (error:any)=>{
    alert('Update failed!!');
  }
}


 // fetch jobs

fetchJobs(){
  this.http.get<any>('http://localhost:6001/fetch-jobs').subscribe(
    (response)=>{
        this.jobs = response.reverse();
        this.displayedjobs = response.reverse();
    }
  )
}


skillFilter: string = '';
locationFilter: string = '';


skillFilterChanged(event: any){
  this.locationFilter = '';
  if(event === ''){
    this.displayedjobs = this.jobs;
  }else{
    this.displayedjobs = this.jobs.filter((job:any)=> job.skills.includes(event));
  }
}

locationFilterChanged(event: any){
  this.skillFilter = '';
  if(event === ''){
    this.displayedjobs = this.jobs;
  }else{

    this.displayedjobs = this.jobs.filter((job:any)=> job.location.includes(event));
  }
}




 // fetch Applications
fetchApplications(){
  this.http.get<any>('http://localhost:6001/fetch-applications').subscribe(
    (response)=>{
        this.applications = response.reverse();
    }
  )
}


// View Job details

jobData: any = {};

viewJob(id: any){
  this.http.get<any>(`http://localhost:6001/fetch-job-data/${id}`).subscribe(
    (response)=>{
      this.userDisplayContent = 'viewJob'
      this.jobData = response;
    }
  )
}

  
// Apply for a property

handleJobApply(jobId: any){
  this.http.post<any>('http://localhost:6001/apply-job', {jobId, userId: this.userId}).subscribe(
    (response)=>{
        alert("Application submitted!!");
        this.fetchJobs();
        this.userDisplayContent='home';
        this.fetchApplications();
    }
  )
}


// Withdraw application

withdrawApplication(applicationId:any){
  this.http.post<any>('http://localhost:6001/withdraw-application', {applicationId, userId: this.userId}).subscribe(
    (response)=>{
      alert("Application cancelled!!");
      this.fetchApplications();
      this.fetchJobs();
    }
  ), (error: any)=>{
    alert("Operation failed!!");
  }
}


// Vacate tenent

vacateTenent(propertyId:any){
  this.http.put<any>('http://localhost:6001/vacate-tenent', {propertyId}).subscribe(
    (response)=>{
      alert("Tenent vacated!!");
      this.fetchApplications();
      this.fetchJobs();
    }
  ), (error: any)=>{
    alert("Operation failed!!");
  }
}








  logout (){
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    this.route.navigate(['']);
  }
}
