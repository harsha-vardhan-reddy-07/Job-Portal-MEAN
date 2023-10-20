import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {User,  Applications, Jobs } from './Schema.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const PORT = 6001;
mongoose.connect('mongodb://localhost:27017/JobPortal', { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{


    // Register user

    app.post('/register', async (req, res) => {
        const { username, email, usertype, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                usertype,
                password: hashedPassword
            });
            const userCreated = await newUser.save();
            return res.status(201).json(userCreated);
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Login user

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {


            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            } else{
                
                return res.json(user);
            }
            
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });


     // new job

     app.post('/new-job', async(req, res)=>{
        const {companyId, companyName, jobTitle, jobDescription, experience, skills, location, CTC, openings} = req.body;

        try{

            const newjob = new Jobs({companyId, companyName, jobTitle, jobDescription, experience, skills, location, CTC, openings});
            await newjob.save();
            res.json({message:"job saved"});
            
        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })

   
    // update job details

    app.post('/update-job', async(req, res)=>{
        const {jobId, jobTitle, jobDescription, experience, skills, location, CTC, openings }  = req.body;

        try{
            const job = await Jobs.findById(jobId);

            job.jobTitle = jobTitle;
            job.jobDescription = jobDescription;
            job.experience = experience;
            job.skills = skills;
            job.location = location;
            job.CTC = CTC;
            job.openings = openings;
            await job.save();
            return res.json({message:"job updated"});
            

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // fetch all jobs

     app.get('/fetch-jobs', async(req, res)=>{
        try{
            const jobs = await Jobs.find();
            res.json(jobs);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })


     // fetch job data

     app.get('/fetch-job-data/:id', async(req, res)=>{
        try{
            const job = await Jobs.findById(req.params.id);
            res.json(job);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })


     
     //  Apply for job

     app.post('/apply-job', async(req, res)=>{
        const {jobId, userId} = req.body;
        try{
            const job = await Jobs.findById(jobId);
            const user = await User.findById(userId);

            const applications = new Applications({jobId, jobTitle: job.jobTitle, jobDescription: job.jobDescription, jobSkills: job.skills, jobExperience: job.experience, jobCTC: job.CTC, jobLocation: job.location, companyId: job.companyId, companyName: job.companyName, applicantId: userId, applicantName: user.username, applicantEmail: user.email, applicantDescription: user.description, applicantSkills: user.skills, applicantExperience: user.experience, applicantResume: user.resume});
            // const applications = new Applications({jobId, jobTitle: job.jobTitle, jobDescription: job.jobDescription, jobSkills: job.skills, jobExperience: job.experience, jobCTC: job.CTC, companyId: job.companyId, companyName: job.companyName, jobLocation: job.location, applicantId: userId, applicantName: user.username, applicantEmail: user.email});
            await applications.save();
            job.applicantsList.push(userId);
            await job.save();

            res.json(applications);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })



    //   // freeze job

      app.put('/freeze-job', async(req, res)=>{
        const {id} = req.body;
        try{
            const job = await Jobs.findById(id);
            job.status = 'Freezed';
            await job.save();
            res.json(job);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })

    //  // activate job

     app.put('/activate-job', async(req, res)=>{
        const {id} = req.body;
        try{
            const job = await Jobs.findById(id);
            job.status = 'Available';
            await job.save();
            res.json(job);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })


    // fetch user data

    app.get('/fetch-user-data/:id', async(req, res)=>{
        try{
            const user = await User.findById(req.params.id);
            res.json(user);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })

      //  fetch all users

    app.get('/fetch-users', async(req, res)=>{
        try{
            const users = await User.find();
            res.json(users);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })

      // update user details

    app.post('/update-user', async(req, res)=>{
        const { userId, username, description, skills, experience, resume}  = req.body;

        try{
            const user = await User.findById(userId);

            user.username = username;
            user.description = description;
            user.experience = experience;
            user.skills = skills;
            user.resume = resume;
            
            
            await user.save();
            return res.json({message:"user updated"});
            

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })



     //  fetch all applications

    app.get('/fetch-applications', async(req, res)=>{
        try{
            const applications = await Applications.find();
            res.json(applications);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })





    // Withdraw user application

     app.post('/withdraw-application', async(req, res)=>{
        const {applicationId, userId} = req.body;
        try{
            const application = await Applications.findById(applicationId);
            application.status = "Withdrawn";

            await Jobs.findByIdAndUpdate(
                application.jobId,
                { $pull: { applicantsList: userId } },
            );
            await application.save();
            res.json(application);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // Approve application

    app.put('/approve-application', async(req, res)=>{
        const {applicationId} = req.body;
        try{
            const application = await Applications.findById(applicationId);
            application.status = "Accepted";

            await application.save();

            res.json(application);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // // reject application

    app.put('/reject-application', async(req, res)=>{
        const {applicationId} = req.body;
        try{
            const application = await Applications.findById(applicationId);
            application.status = "Rejected";

            await Jobs.findByIdAndUpdate(
                application.jobId,
                { $pull: { applicantsList: application.applicantId } },
            );

            await application.save();
            res.json(application);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // // vacate tenent

    // app.put('/vacate-tenent', async(req, res)=>{
    //     const {propertyId} = req.body;
    //     try{
    //         const property = await Property.findById(propertyId);
    //         property.status = "Available";
    //         property.tenentId = '';
    //         property.tenentName = '';
    //         property.rentStartDate = '';

    //         await property.save();
    //         res.json(property);

    //     }catch(err){
    //         res.status(500).json({message: 'error occured'});
    //     }
    // })

     



    app.listen(PORT, ()=>{
        console.log(`Running @ ${PORT}`);
    });
}
).catch((e)=> console.log(`Error in db connection ${e}`));