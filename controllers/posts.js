import mongoose from 'mongoose'
import PostMessage from '../models/postMessage.js'

export const getPost = async (req, res) => {
  const { id } = req.params

  try {
    const post = await PostMessage.findById(id)

    res.status(200).json(post)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
export const getPosts = async (req, res) => {
  console.log(req.url)
  console.log(req.query)

  const { page } = req.query

  try {
    const LIMIT = 5
    const startIndex = (Number(page) - 1) * LIMIT // get starting index of every page.
    const total = await PostMessage.countDocuments({})
    // console.log(total);
    // console.log(Math.ceil(total/LIMIT));

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex)

    res
      .status(200)
      .json({
        data: posts,
        currentPage: Number(page),
        NumberOfPage: Math.ceil(total / LIMIT),
      })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
// params and query are two different things
//QUERY -> posts?page=1 -> page = 1
//PARAMS -> /posts/123 -> id = 123

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query

  try {
    console.log(searchQuery, tags)
    const title = new RegExp(searchQuery, 'i')
    console.log(title) // i stands for ignore that means if we search (test test test ) then it convert that into only (test);
    // we convert searchQuery into RegExp(regular expression ) that is easier for mongoose to search in database;

    // split() method return new array.
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    })
    //   pincode.find({ "city_id": { "$in": idList } },function(err,docs) {
    //     // do something here
    //  });
    // above commented code is short form of below mentioned .
    //   pincode.find(
    //     {
    //         "$or": [
    //             { "city_id": "559e0dbd045ac712fa1f19fa" },
    //             { "city_id": "559e0dbe045ac712fa1f19fb" }
    //         ]
    //     },
    //     function(err,docs) {
    //         // do something here
    //     }
    // )

    console.log(posts)
    res.json({ data: posts })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  const post = req.body
  console.log('in createpost controllers')
  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  })
  console.log(newPostMessage)

  try {
    await newPostMessage.save()

    res.status(201).json(newPostMessage)
  } catch (error) {
    console.log('error occur in create post')
    res.status(409).json({ message: error.message })
  }
}
//post/123
export const updatePost = async (req, res) => {
  const { id: _id } = req.params
  const post = req.body
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No post with this id')

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  })

  res.json(updatedPost)
}

export const deletePost = async (req, res) => {
  const { id: _id } = req.params

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No post with this id')

  await PostMessage.findByIdAndRemove(_id)
  res.json({ message: 'Post deleted successfully' })
}

export const likePost = async (req, res) => {
  const { id } = req.params

  if (!req.userId) return res.status(400).json({ message: 'Unauthenticated' })

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No post with this id')

  const post = await PostMessage.findById(id)
  const index = post.likes.findIndex((id) => id === String(req.userId))

  if (index === -1) {
    // like the post
    post.likes.push(req.userId)
  } else {
    // dislike the post;
    post.likes = post.likes.filter((id) => id !== String(req.userId))
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  })
  res.json(updatedPost)
}
