import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent  implements OnInit{

  companyDisplayContent: string = 'home';

  username: string|null = localStorage.getItem('username');
  userId: string|null = localStorage.getItem('userid');

  
  constructor(private route: Router, private http: HttpClient){}
  
  
  ngOnInit(): void {
        this.fetchApplications();
        this.fetchJobs();
  }


  companyId: string|null = localStorage.getItem('userid');
  companyName: string|null = localStorage.getItem('username');


  jobTitle: string = '';
  jobDescription: string = '';
  experience: string = '';
  skills: string = '';
  location: string = '';
  CTC: string = '';
  openings: number = 0;

  
  jobs: any[] = [];
  applications: any[] = []; 

  updatingJobId: string = '';

  jobTitleUpdate: string = '';
  jobDescriptionUpdate: string = '';
  experienceUpdate: string = '';
  skillsUpdate: string = '';
  locationUpdate: string = '';
  CTCUpdate: string = '';
  openingsUpdate: number = 0;



// fetch jobs

fetchJobs(){
  this.http.get<any>('http://localhost:6001/fetch-jobs').subscribe(
    (response)=>{
        this.jobs = response.filter((job:any)=> job.companyId === this.companyId).reverse();
        console.log(response);
    }
  )
}


// new Job

newJob(){
  this.http.post<any>('http://localhost:6001/new-job', {companyId: this.companyId, companyName: this.companyName, jobTitle: this.jobTitle, jobDescription: this.jobDescription, experience: this.experience, skills: this.skills, location: this.location, CTC: this.CTC, openings: this.openings}).subscribe(

    (response)=>{
      alert("new job added");
      this.fetchJobs();
      this.companyDisplayContent = 'home';
      this.jobTitle = '';
      this.jobDescription = '';
      this.experience = '';
      this.skills = '';
      this.location = '';
      this.CTC = '';
      this.openings = 0;
    }
  ), (error:any)=>{
    alert('job posting failed!!');
  }
}

// handle update property

handleUpdate(id: any){

  this.fetchJobDetails(id);
  this.companyDisplayContent = 'updatejob';
}

// fetch update property details

fetchJobDetails(id: any){
  this.http.get<any>(`http://localhost:6001/fetch-job-data/${id}`).subscribe(
    (response)=>{
      this.updatingJobId = response._id;
      this.jobTitleUpdate = response.jobTitle;
      this.jobDescriptionUpdate = response.jobDescription;
      this.experienceUpdate = response.experience;
      this.skillsUpdate = response.skills;
      this.locationUpdate = response.location;
      this.CTCUpdate = response.CTC;
      this.openingsUpdate = response.openings;
    }
  )
}

// update property

updateProperty(){
  this.http.post<any>('http://localhost:6001/update-job', { jobId: this.updatingJobId, jobTitle: this.jobTitleUpdate, jobDescription: this.jobDescriptionUpdate, experience: this.experienceUpdate, skills: this.skillsUpdate, location: this.locationUpdate, CTC: this.CTCUpdate, openings: this.openingsUpdate}).subscribe(

    (response)=>{
      alert("updated!!");
      this.fetchJobs();
      this.companyDisplayContent = 'home';
    }
  ), (error:any)=>{
    alert('Update failed!!');
  }
}

// freeze property  - cancels tenent and disables from public

freezeJob(id: any){
  this.http.put<any>('http://localhost:6001/freeze-job', {id}).subscribe(
    (response)=>{
        alert('Hiring freezed');
        this.fetchJobs();
    }
  )
}

// activate property

activateJob(id: any){
  this.http.put<any>('http://localhost:6001/activate-job', {id}).subscribe(
    (response)=>{
        alert('Hiring activated');
        this.fetchJobs();
    }
  )
}


// fetch Applications
fetchApplications(){
  this.http.get<any>('http://localhost:6001/fetch-applications').subscribe(
    (response)=>{
        this.applications = response.reverse();
    }
  )
}
 

// Approve application

approveApplication(applicationId: any){
  this.http.put<any>('http://localhost:6001/approve-application', {applicationId}).subscribe(
    (response)=>{
        alert("Application accepted!!");
        this.fetchJobs();
        this.fetchApplications();
    }
  )
}


// Reject application

rejectApplication(applicationId: any){
  this.http.put<any>('http://localhost:6001/reject-application', {applicationId}).subscribe(
    (response)=>{
        alert("Application rejected!!");
        this.fetchJobs();
        this.fetchApplications();
    }
  )
}

// Vacate tenent

// vacateTenent(propertyId:any){
//   this.http.put<any>('http://localhost:6001/vacate-tenent', {propertyId}).subscribe(
//     (response)=>{
//       alert("Tenent vacated!!");
//       this.fetchApplications();
//       this.fetchProperties();
//     }
//   ), (error: any)=>{
//     alert("Operation failed!!");
//   }
// }


  

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