import { create } from "domain";
import fs, { readFile } from "fs";

export const getAllPolls = (req, res) => {
    fs.readFile("db.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading polls data" });
        }

        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData.polls);
    });
};


export const getPollDetails = (req, res) => {
  const pollId = parseInt(req.params.id);

  fs.readFile("db.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading data" });
    }

    const jsonData = JSON.parse(data);

    const poll = jsonData.polls.find(p => p.id === pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const options = jsonData.options.filter(
      option => option.pollId === pollId
    );

    res.status(200).json({
      poll,
      options
    });
  });
};



export const createPoll = (req, res) => {
  const { question, options } = req.body;

  if (!question || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ message: "Invalid poll data" });
  }

  fs.readFile("db.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading polls data" });
    }

    const jsonData = JSON.parse(data);
    const pollId = Date.now();

    jsonData.polls.push({
      id: pollId,
      question,
      isActive: true,
      createdAt: new Date().toISOString()
    });
    
    
    options.forEach((text, index) => {
      jsonData.options.push({
        id: pollId + index + 1,
        pollId: pollId,
        text,
        votes: 0
      });
    });

    fs.writeFile("db.json", JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        return res.status(500).json({ message: "Error saving poll" });
      }
      res.status(201).json({ message: "Poll created successfully" });
    });
  });
};


export const votePoll = (req, res) => {
  const pollId = parseInt(req.params.id);
  const { optionId } = req.body;

  if (!optionId) {
    return res.status(400).json({ message: "Option ID is required" });
  }

  fs.readFile("db.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading data" });
    }

    const jsonData = JSON.parse(data);

    const poll = jsonData.polls.find(p => p.id === pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    
    
    const option = jsonData.options.find(
      opt => opt.id === optionId && opt.pollId === pollId
    );

    if (!option) {
      return res.status(404).json({ message: "Option not found" });
    }

    
    option.votes += 1;
    
    jsonData.votes.push({
      id: Date.now(),
      pollId,
      optionId,
      votedAt: new Date().toISOString()
    });
    
    fs.writeFile(
      "db.json",
      JSON.stringify(jsonData, null, 2),
      err => {
        if (err) {
          return res.status(500).json({ message: "Error saving vote" });
        }

        res.status(200).json({ message: "Vote recorded successfully" });
      }
    );
  });
};


export const getPollResults = (req, res) => {
  const pollId = parseInt(req.params.id); 
  fs.readFile("db.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading data" });
    }
    const jsonData = JSON.parse(data);

    const poll = jsonData.polls.find(p => p.id === pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    const options = jsonData.options.filter(
      option => option.pollId === pollId
    );
    res.status(200).json({
      poll,
      options
    });
  });
}



export const deletePoll = (req, res) => {
  const pollId = parseInt(req.params.id);

  fs.readFile("db.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading data" });
    }

    const jsonData = JSON.parse(data);

    const pollExists = jsonData.polls.find(p => p.id === pollId);
    if (!pollExists) {
      return res.status(404).json({ message: "Poll not found" });
    }
    jsonData.polls = jsonData.polls.filter(p => p.id !== pollId);

    jsonData.options = jsonData.options.filter(opt => opt.pollId !== pollId);

    jsonData.votes = jsonData.votes.filter(v => v.pollId !== pollId);

    fs.writeFile("db.json", JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        return res.status(500).json({ message: "Error deleting poll" });
      }
      res.status(200).json({ message: "Poll deleted successfully" });
    });
  });
};


