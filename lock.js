const token = process.env.GITHUB_TOKEN

async function getList() {
  const resp = await fetch('https://api.github.com/repos/jw-12138/jw-12138.github.io/issues', {
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return await resp.json()
}

const list = await getList()

async function lock(issueNumber) {
  const resp = await fetch(`https://api.github.com/repos/jw-12138/jw-12138.github.io/issues/${issueNumber}/lock`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Length': '0'
    }
  })

  return await resp.json()
}

for (const issue of list) {
  if (issue.state === 'open') {
    const log = await lock(issue.number)
    console.log(log)
  }
}
