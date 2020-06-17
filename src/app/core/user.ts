export interface User {
    uid?: String, 
    email?: String,
    role?: String,
    status?: String,
    displayName? : String,
    lastName? : String,
    dob? : Date,
    yearsExperience? : String,
    phoneNumber? : String,
    address1? : String,
    address2? : String,
    City? : String,
    State? : String,
    Zip? : String,
    photoURL? : String,
    credits? : number,
    completedReviewsCount?: number,
    totalCreditsEarned?: number,
    reviewPrice?: String,
    notifications?: String,
    achievements?: String[]
};
  