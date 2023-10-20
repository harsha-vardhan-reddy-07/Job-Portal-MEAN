import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    password: { type: String, required: true },
    description: {type: String, default:''},
    skills: {type: String, default:''},
    experience: {type: String, default:''},
    resume: {type: String, default:''},
})


const jobsSchema = new mongoose.Schema({
    companyId: {type: String},
    companyName: {type: String},
    jobTitle: {type: String},
    jobDescription: {type: String},
    experience: {type: String},
    skills: {type: String},
    location: {type: String},
    CTC: {type: String},
    openings: {type: Number},
    status: {type: String, default: 'Available'},
    applicantsList: {type: Array, default : []}
})

const applicationSchema = new mongoose.Schema({
    jobId: {type: String},
    jobTitle: {type: String},
    jobDescription: {type: String},
    jobSkills: {type: String},
    jobLocation: {type: String},
    jobCTC: {type: String},
    jobExperience: {type: String},
    companyId: {type: String},
    companyName: {type: String},
    applicantId: {type: String},
    applicantName: {type: String},
    applicantEmail: {type: String},
    applicantDescription: {type: String},
    applicantSkills: {type: String},
    applicantExperience: {type: String},
    applicantResume: {type: String},
    status: {type: String, default:'Pending'}
})

export const User = mongoose.model('users', userSchema);
export const Jobs = mongoose.model('jobs', jobsSchema);
export const Applications = mongoose.model('applications', applicationSchema);