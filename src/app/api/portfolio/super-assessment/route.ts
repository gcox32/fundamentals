import { NextRequest, NextResponse } from 'next/server';
import { hashKey } from '@/lib/utilities/hashKey';
import { buildPrompt } from '@/lib/super-assessment/prompt';
import { getAssessment, putAssessment } from '@/lib/super-assessment/dyanmo';
import { callOpenAI } from '@/lib/super-assessment/openai';
import { getInvestorPrinciples } from '@/lib/super-assessment/principles';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { forceRefresh, userId, investor, holdings } = body;

        const key = hashKey({ investor, userId, holdings });

        const cached = await getAssessment(key);
        if (cached && !forceRefresh) {
            return NextResponse.json({
                source: 'cache',
                text: cached.text,
                generatedAt: cached.generatedAt,
            });
        }

        // 2. Build prompt and call OpenAI
        const principles = await getInvestorPrinciples(investor);
        const prompt = buildPrompt({ investor, holdings, principles });
        const text = await callOpenAI(prompt);
        
        // 3. Store in Dynamo
        const generatedAt = new Date().toISOString();
        await putAssessment({ key, text, generatedAt });

        return NextResponse.json({ source: 'openai', text, generatedAt });
    } catch (err: any) {
        console.error('Super Assessment Error:', err);
        return NextResponse.json({ error: 'Failed to generate assessment' }, { status: 500 });
    }
}
