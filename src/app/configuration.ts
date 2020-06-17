export const configuration = {
    header : {
        heading: 'Coach Connect Sports',
        headingtext: 'Connecting Athletes to Experience',
        buttontext: 'about',
        buttonlink: '#about'
    },
    intro : {
        tagline: 'Achieve your goals',
        title: 'Why Coach Connect',
        description: 'Coach Connect Sports is an innovative coaching service that gives athletes the opportunity to connect with coaches within their sport. CCS provides athletes with the tools to improve their craft, master techniques, and become a more well rounded competitor.',
        blocks:[{
            icon: 'html5',
            title: 'Our Mission', 
            description: 'We strive to help ALL athletes get the proper advice, coaching, and expertise to reach their highest potential.',
          },
          {
            icon: 'bolt',
            title: 'What to Expect', 
            description: 'Upload a video. Choose your coach. And receive in depth technical analysis through audio & written feedback on your video.'
          },
          {
            icon: 'tablet',
            title: 'Expand your Network', 
            description: 'Access coaches that we\'re previously unreachable. We are giving you the tools to learn from the best coaches - no matter where they are. '
          },
          {
            icon: 'rocket',
            title: 'Every Skill Level', 
            description: 'Whether you\'re just getting started or looking to take things up a notch - Our coaches are ready to help you reach your goals.'
          }],
        
    },
    services : {
        tagline: 'Learn a bit more about what we do',
        title: 'Understanding our Product',
        description: 'Ready to get Connected? Check out this video walkthrough of our platform and create an account to begin reaching your full potential.',
        testimonial: 'Genius product! Every athlete should be taking advantage of the added potential provided by this service.',
        person: 'Katie G ', 
        persondescription : '(Chicago, Illinois)',
        textblock1 : '',
        textblock2 : ''

    },
    testimonials : {
        tagline: "Don't take it from us...",
        title: "Here's What people are saying",
        feedbacks : [
            {name : '', image: 'circle.png', comments: 'As an athlete I was always seeking out the best coaches. Coach Connect Sports, it is a very easy way to get some more eyes on you as an athlete, all within the comfort of your own home.', company: ''},
            {name : '', image: 'circle.png', comments: 'The coach provided detailed audio feedback which helped prep our son for his next match. We and so excited to continue using Coach Connect Sports in the future.', company: ''},
            {name : '', image: 'circle.png', comments: 'I know for me, video review has been a huge part of my growth and development. It can help you better understand what you are doing right or wrong.', company: ''},
        ]
    },
    clients : {
        tagline: 'Learn from the Best',
        title: 'Meet our Coaches',
        description: 'We strive to provide you with coaches who have proven themselves at the highest level. We pride ourselves in delivering the best of the best to help you improve day in and day out.'
    },
    pricing : {
        tagline: 'start reaching your full potental today',
        title: 'Video Review Packages',
        description: '',
        currency: '$',
        buttontext: 'buy',
    },
    gallery : {
        images : [
            'gallery-image-1.jpg',
            'gallery-image-2.jpg',
            'gallery-image-3.jpg',
            'gallery-image-4.jpg',
            'gallery-image-5.jpg',
            'gallery-image-6.jpg',
        ]
    },
    footer : {
        text: 'Questions or Comments? Email ',
        link: '#',
        developer: 'customersupport@coachconnectsports.com',
    },
    videoListColumnLabels : {
        screenshot : 'Video',
        dateUploaded : 'Upload Date',
        outcome : 'Match Outcome',
        comments : 'Personal Comments',
        status : 'Review Status',
        dateReviewed : 'Date Reviewed',
        reviewer : 'Reviewer'
    },
    socialservices : [
        {title: 'Facebook', target: '_blank', username: 'coachconnectsports', link: 'https://www.facebook.com/', icon: 'facebook'},
        {title: 'Instagram', target: '_blank', username: 'coachconnectsports', link: 'http://www.instagram.com/', icon: 'instagram'},
    ],
    videoUploadFormFields : {
        opponent : "",
        weight : "0",
        matchDate : "",
        home : "",
        outcome : "",
        scoreW : "0",
        scoreL : "0",
        pin : "",
        comments : "",
        reviewer : ""
    },
    userFormFields : [
        'email',
        'displayName',
        'lastName',
        'dob',
        'yearsExperience',
        'phoneNumber',
        'address1',
        'address2',
        'City',
        'State',
        'Zip'
    ],
    sortUserInfo: function(a,b) {

        const userFormFields = [
            'email',
            'displayName',
            'lastName',
            'dob',
            'yearsExperience',
            'phoneNumber',
            'address1',
            'address2',
            'City',
            'State',
            'Zip'
        ];
        const indexA = userFormFields.indexOf(a);
        const indexB = userFormFields.indexOf(b);
        if (indexA < indexB)
            return -1;
        if (indexA > indexB)
            return 1;
        return 0;
    },
    labels : {
        screenshot : "Video Cover Photo",
        dateUploaded : "Date of Upload",
        reviewStatus : "Review Status",
        dateReviewed : "Date Reviewed",
        reviewer : "Reviewer",
        description : "Your Description",
        outcome : "Match Outcome",
        comments : "Your comments about the match (The reviewer will see these)",
        uid: "User ID", 
        email: "Email",
        role : "User Role",
        status : "Active",
        displayName : "First Name",
        lastName : "Last Name",
        dob : "Date of Birth",
        organizationIds: "Organizations",
        yearsExperience : "Wrestling Experience (Years)",
        phoneNumber : "Phone Number",
        address1 : "Address (line 1)",
        address2 : "Address (line 2)",
        City : "City",
        State : "State",
        Zip : "ZipCode",
        credits : "Review Credits",
        completedReviewsCount : "Completed Reviews"
    }
}
