import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

function generateJobId() {
  return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, agent_type = 'gemini-vision' } = body;

    const jobId = generateJobId();
    const jobData = {
      id: jobId,
      status: 'PENDING',
      prompt,
      agent_type,
      createdAt: Date.now(),
      result: null
    };

    await redis.set(`job:${jobId}`, JSON.stringify(jobData), { ex: 3600 });
    await redis.lpush('job_queue', jobId);

    return NextResponse.json({
      success: true,
      job_id: jobId,
      status: "PENDING",
      message: "Vision accepted. The Deep Mind has been signaled."
    }, { status: 202 });

  } catch (error) {
    console.error("Ritual Failed:", error);
    return NextResponse.json(
      { success: false, error: "Synapse failure." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('job_id');

  if (!jobId) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

  const job = await redis.get(`job:${jobId}`);
  
  if (!job) {
    return NextResponse.json({ error: "Dream not found." }, { status: 404 });
  }

  return NextResponse.json(typeof job === 'string' ? JSON.parse(job) : job);
}