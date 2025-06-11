
const express = require('express');
const axios = require('axios');
const router = express.Router();

const GITHUB_TOKEN = process.env.GITHUB_TOKENN;

// Fetch contents of repo at path
const getRepoContents = async (owner, repo, path = '') => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'User-Agent': 'MERN-App',
      Accept: 'application/vnd.github.v3+json',
    },
  });
  return response.data;
};

// Recursive function to build tree structure
const buildTree = async (owner, repo, path = '') => {
  const items = await getRepoContents(owner, repo, path);

  const tree = await Promise.all(
    items.map(async (item) => {
      if (item.type === 'dir') {
        return {
          name: item.name,
          path: item.path,
          type: 'folder',
          children: await buildTree(owner, repo, item.path),
        };
      } else {
        return {
          name: item.name,
          path: item.path,
          type: 'file',
        };
      }
    })
  );

  return tree;
};

router.post('/tree', async (req, res) => {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({ message: 'GitHub URL is required' });
    }

    // Extract owner and repo from GitHub URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return res.status(400).json({ message: 'Invalid GitHub URL' });
    }

    const owner = match[1];
    const repo = match[2];

    const tree = await buildTree(owner, repo);

    res.json(tree);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to build folder tree', error: error.message });
  }
});

module.exports = router;
