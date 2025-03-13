import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema(
    {
        featuredImage: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        slug: {
            type: String,
            unique: true
        },
        content: {
            type: String, 
            required: true
        },
        status: {
            type: Boolean,
            default: 0
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        timestamps: true
    }
)

postSchema.plugin(mongooseAggregatePaginate)

// Pre-save hook to generate a unique slug
postSchema.pre("validate", async function (next) {
    if (!this.isModified("title")) return next();

    let slug = this.title
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    let existingPost = await this.constructor.findOne({ slug });
    let count = 1;

    // Append a counter if the slug already exists
    while (existingPost) {
        slug = `${slug}-${count}`;
        existingPost = await this.constructor.findOne({ slug });
        count++;
    }

    this.slug = slug;
    next();
});



export const Post = mongoose.model("Post", postSchema)