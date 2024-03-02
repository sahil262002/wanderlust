const Joi = require("joi");

const reviewSchema = Joi.object({

        comment: Joi.string().required(),
        rating:Joi.number().required(),
    
});

module.exports = reviewSchema;
