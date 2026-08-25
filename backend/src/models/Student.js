const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {


        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        refreshToken: {
            type: String,
            default: null
        },



        profile: {
            phone: {
                type: String
            },

            college: {
                type: String
            },

            branch: {
                type: String
            },

            semester: {
                type: Number
            },

            cgpa: {
                type: Number
            },

            graduationYear: {
                type: Number
            },

            github: {
                type: String
            },

            linkedin: {
                type: String
            },

            class12: {
                school: {
                    type: String
                },

                percentage: {
                    type: Number
                },

                passingYear: {
                    type: Number
                }
            },



            class10: {
                school: {
                    type: String
                },

                percentage: {
                    type: Number
                },

                passingYear: {
                    type: Number
                }
            }
        },


        skills: [
            {
                name: {
                    type: String,
                    required: true
                },

                selfLevel: {
                    type: Number,
                    min: 1,
                    max: 5,
                    required: true
                }
            }
        ],



        achievements: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true
                },

                description: {
                    type: String,
                    trim: true
                },

                date: {
                    type: Date
                },

                link: {
                    type: String,
                    default: null,
                    trim: true
                }
            }
        ],

   

        targetCompanies: [
            {
                companyName: {
                    type: String,
                    required: true
                },

                priority: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;