
import express from "express";
import {
  getAllPolls,
    getPollDetails,
    createPoll,votePoll, getPollResults,deletePoll
} from "../controllers/pollController.js";

const router = express.Router();

// API endpoints matching assignment requirements
router.get("/polls", getAllPolls);              // GET /polls - Get all active polls
router.get("/polls/:id", getPollDetails);       // GET /polls/:id - Get poll details
router.post("/polls", createPoll);              // POST /polls - Create a poll (admin)
router.post("/polls/:id/vote", votePoll);       // POST /polls/:id/vote - Vote on a poll
router.get("/polls/:id/results", getPollResults); // GET /polls/:id/results - Get poll results

// Additional endpoint for delete functionality
router.delete("/polls/:id", deletePoll);

export default router;
