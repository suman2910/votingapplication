const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const isLoggedin = require("../middleware/middlefunction");
const Candidate = require("../models/Candidate");


async function isAdmin(id) {
    const profile = await User.findById(id);
    return profile && profile.role === "admin";
}


router.post("/createcandidate", isLoggedin, async (req, res) => {
    try {
        const isUserAdmin = await isAdmin(req.user._id);
        if (!isUserAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const candidateData = req.body;
        await Candidate.create(candidateData);
        res.status(201).json({ message: "Candidate created successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.put("/:candidateID", isLoggedin, async (req, res) => {
    try {
        const isUserAdmin = await isAdmin(req.user._id);
        if (!isUserAdmin) {
            return res.status(403).json({
                message: "Access denied. User does not have admin role."
            });
        }

        const candidateID = req.params.candidateID;
        const updateCandidateData = req.body;

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            candidateID,
            updateCandidateData,
            { new: true } 
        );

        if (!updatedCandidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        res.status(200).json(updatedCandidate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.delete("/:candidateId", async (req, res) => {
    try {
        const candidateId = req.params.candidateId;
        const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
        
        if (!deletedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/vote/:candidateId", isLoggedin, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Access denied. Admins cannot vote." });
    }

    if (user.isVoted) {
      return res.status(403).json({ message: "User has already voted." });
    }

    const candidateId = req.params.candidateId;
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    candidate.votes.push({ user: userId });
    candidate.voteCount++;

    user.isVoted = true;

   
    await candidate.save();
    await user.save();

    res.status(200).json({ message: "Vote cast successfully." });

  } catch (err) {
    console.error("Error while voting:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});


module.exports = router;
