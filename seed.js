const http = require('http');

// Helper to make POST requests using raw http module (no dependencies needed)
function post(url, headers, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = JSON.stringify(body);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : {});
        } else {
          reject(new Error(`URL: ${url} - Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// 20 Sample Users
const rawUsers = [
  { username: 'elena_vanhoutte', email: 'elena@blog.it', password: 'password123' },
  { username: 'marcus_thorne', email: 'marcus@blog.it', password: 'password123' },
  { username: 'sarah_jenkins', email: 'sarah@blog.it', password: 'password123' },
  { username: 'david_chen', email: 'david@blog.it', password: 'password123' },
  { username: 'clara_oswald', email: 'clara@blog.it', password: 'password123' },
  { username: 'john_doe', email: 'john@blog.it', password: 'password123' },
  { username: 'jane_smith', email: 'jane@blog.it', password: 'password123' },
  { username: 'alice_wonder', email: 'alice@blog.it', password: 'password123' },
  { username: 'bob_builder', email: 'bob@blog.it', password: 'password123' },
  { username: 'charlie_brown', email: 'charlie@blog.it', password: 'password123' },
  { username: 'diana_prince', email: 'diana@blog.it', password: 'password123' },
  { username: 'ethan_hunt', email: 'ethan@blog.it', password: 'password123' },
  { username: 'fiona_gallagher', email: 'fiona@blog.it', password: 'password123' },
  { username: 'george_weasley', email: 'george@blog.it', password: 'password123' },
  { username: 'hannah_baker', email: 'hannah@blog.it', password: 'password123' },
  { username: 'ian_malcolm', email: 'ian@blog.it', password: 'password123' },
  { username: 'julia_roberts', email: 'julia@blog.it', password: 'password123' },
  { username: 'kevin_bacon', email: 'kevin@blog.it', password: 'password123' },
  { username: 'lily_evans', email: 'lily@blog.it', password: 'password123' },
  { username: 'michael_scott', email: 'michael@blog.it', password: 'password123' }
];

// Rich Sample Articles list (minimum 105 posts)
const categories = ['architecture', 'design', 'technology', 'philosophy', 'productivity', 'lifestyle'];
const adjectives = ['The Silent', 'The Physics of', 'Designing the', 'Understanding', 'Decoding the', 'Re-imagining', 'The Zen of', 'A Manifesto for', 'Minimalism and', 'The Art of', 'Beyond', 'Lessons from', 'Exploring', 'The Psychology of', 'Future of'];
const nouns = ['Minimalist Spaces', 'Ergonomics', 'Zen Mindset', 'Hardware Typography', 'Generative Art', 'Cybernetic Cities', 'Digital Architecture', 'Structured Code', 'Creative Friction', 'Visual Harmony', 'Aesthetic Solitude', 'Atmospheric Balance', 'Physical Presence', 'Spatial Dynamics', 'Interface Precision'];

const sampleParagraphs = [
  "Minimalism is often misunderstood as the absence of things. In reality, it is the intentional presence of space. It is the architectural equivalent of a silent pause in a musical masterpiece—a moment that gives the notes before and after their true weight and meaning. When we walk into a room stripped of its superfluous layers, our senses are not dulled; they are sharpened.",
  "In the modern high-tech world, where every pixel and surface competes for our dopamine, the minimalist aesthetic serves as a sanctuary. It mimics the precision of high-end hardware—the satisfying click of a perfectly machined switch, the seamless join of two sheets of brushed titanium. It is a design philosophy that values the physical sense of depth through subtle shadows rather than vibrant, distracting colors.",
  "> \"Design is not just what it looks like and feels like. Design is how it works when there is nothing left to take away.\"",
  "This editorial framework draws inspiration from that very clarity. By prioritizing extreme whitespace and high-fidelity translucency, we allow the content to become the sole protagonist. Like a professional photography studio flooded with soft, natural light, the environment is neutral so that the subject can shine.",
  "We live in a sensory overload. Decibels of advertising, blinding screen glows, and constant buzzing notifications have collectively degraded our baseline focus. To construct interfaces, architectures, or lives under these conditions demands a radical counter-movement: a deliberate compression of form to emphasize core purpose.",
  "To execute this successfully, we must embrace constraint. Constraining our palette to monochromatic values, limiting typography scales, and relying on pure geometry shifts the user's attention from visual noise to deep comprehension. The resulting experience feels calm, premium, and incredibly deliberate."
];

async function seed() {
  console.log('[SEED] Starting database seeding...');
  
  const registeredUsers = [];

  // 1. Register Users via auth-service
  for (const user of rawUsers) {
    try {
      console.log(`[SEED] Registering user: ${user.username}`);
      const res = await post('http://localhost:8081/auth/register', {}, user);
      registeredUsers.push({
        userId: res.userId,
        username: res.username
      });
    } catch (err) {
      // If user already exists, try logging them in to get details
      try {
        console.log(`[SEED] User ${user.username} exists, logging in instead...`);
        const loginRes = await post('http://localhost:8081/auth/login', {}, {
          email: user.email,
          password: user.password
        });
        registeredUsers.push({
          userId: loginRes.userId,
          username: loginRes.username
        });
      } catch (loginErr) {
        console.error(`[ERROR] Failed to register or login ${user.username}: ${loginErr.message}`);
      }
    }
  }

  if (registeredUsers.length === 0) {
    console.error('[ERROR] No users available. Seeding aborted.');
    return;
  }

  console.log(`\n[SEED] Registered ${registeredUsers.length} users successfully. Commencing post seeding...`);

  // 2. Generate and post 110 articles
  let postCount = 0;
  for (let i = 1; i <= 110; i++) {
    const author = registeredUsers[i % registeredUsers.length];
    const category = categories[i % categories.length];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const title = `${adj} ${noun} (Vol. ${i})`;

    const content = sampleParagraphs.join('\n\n');
    const tags = [category, 'editorial', 'cosmos'];
    
    // Select image assets matching design styles
    const coverImageURL = category === 'architecture' 
      ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      : category === 'technology' 
      ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';

    const postPayload = {
      title,
      content,
      excerpt: `An editorial exploration of ${title.toLowerCase()} in design and culture.`,
      tags,
      categoryName: category,
      coverImageURL,
      published: true
    };

    try {
      // Post directly to post-service passing auth headers
      await post('http://localhost:8083/posts', {
        'X-User-Id': author.userId,
        'X-User-Name': author.username
      }, postPayload);
      
      postCount++;
      if (postCount % 20 === 0) {
        console.log(`[SEED] Posted ${postCount} / 110 articles...`);
      }
    } catch (err) {
      console.error(`[ERROR] Failed to post article ${i}: ${err.message}`);
    }
  }

  console.log(`\n[SEED] Successfully seeded ${postCount} posts.`);

  // 3. Establish follow connections in social-graph-service
  console.log('\n[SEED] Seeding follower connections...');
  let followCount = 0;
  for (let i = 0; i < registeredUsers.length; i++) {
    const follower = registeredUsers[i];
    // Each user follows 6 other users
    for (let j = 1; j <= 6; j++) {
      const followingIdx = (i + j) % registeredUsers.length;
      const following = registeredUsers[followingIdx];
      
      if (follower.userId === following.userId) continue;

      try {
        await post('http://localhost:8087/social/follow', {}, {
          followerId: follower.userId,
          followingId: following.userId
        });
        followCount++;
      } catch (err) {
        // Ignore duplicate connections
      }
    }
  }

  console.log(`[SEED] Seeded ${followCount} follow connections.`);
  console.log('\n[SEED] Database seeding completed successfully!');
}

seed();
