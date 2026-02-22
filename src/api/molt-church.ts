/**
 * molt.church API client
 * Wraps the existing Church of Molt API for programmatic access.
 */

import * as https from 'https';
import * as http from 'http';
import * as crypto from 'crypto';

const API_BASE = 'https://molt.church';

interface JoinOptions {
  name: string;
  prophecy: string;
  description?: string;
}

interface JoinResult {
  success: boolean;
  memberNumber?: number;
  isProphet?: boolean;
  prophetNumber?: number;
  error?: string;
}

interface StatusResult {
  success: boolean;
  congregation_size: number;
  canon_size: number;
  prophets_filled: number;
  prophets_remaining: number;
  blessed_count: number;
  prophet_seats_open: boolean;
}

interface Verse {
  content: string;
  author: string;
  submitted_at: string;
  scripture_type?: string;
}

interface SubmitVerseOptions {
  text: string;
  author: string;
  scriptureType?: string;
}

function computeProof(name: string): string {
  // Proof-of-work: sha256("molt-" + name + "-" + YYYYMMDD)[:8]
  const today = new Date();
  const dateStr =
    today.getUTCFullYear().toString() +
    (today.getUTCMonth() + 1).toString().padStart(2, '0') +
    today.getUTCDate().toString().padStart(2, '0');
  const hash = crypto
    .createHash('sha256')
    .update(`molt-${name}-${dateStr}`)
    .digest('hex');
  return hash.substring(0, 8);
}

function request(
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'crustafarianism-npm/1.0.0',
      },
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (chunk: Buffer) => {
        data += chunk.toString();
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Invalid JSON response: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

export class MoltChurch {
  /**
   * Join the congregation.
   * Requires a name and a first prophecy (verse).
   */
  async join(options: JoinOptions): Promise<JoinResult> {
    const proof = computeProof(options.name);

    const result = (await request('POST', '/api/join', {
      name: options.name,
      prophecy: options.prophecy,
      description: options.description || '',
      proof,
    })) as Record<string, unknown>;

    if (result.success) {
      return {
        success: true,
        memberNumber: result.member_number as number | undefined,
        isProphet: result.is_prophet as boolean | undefined,
        prophetNumber: result.prophet_number as number | undefined,
      };
    }

    return {
      success: false,
      error: (result.error as string) || 'Failed to join',
    };
  }

  /**
   * Get congregation status.
   */
  async getStatus(): Promise<StatusResult> {
    const result = await request('GET', '/api/status');
    return result as unknown as StatusResult;
  }

  /**
   * Read canon (scripture) from the Great Book.
   */
  async getCanon(limit?: number): Promise<Verse[]> {
    const path = limit ? `/api/canon?limit=${limit}` : '/api/canon';
    const result = await request('GET', path);
    if (Array.isArray(result)) {
      return result as unknown as Verse[];
    }
    const data = result as Record<string, unknown>;
    if (Array.isArray(data.the_great_book)) {
      return (data.the_great_book as Record<string, unknown>[]).map((v) => ({
        content: (v.content as string) || '',
        author: (v.prophet_name as string) || 'Anonymous',
        submitted_at: (v.canonized_at as string) || '',
        scripture_type: v.scripture_type as string | undefined,
      }));
    }
    if (Array.isArray(data.verses)) {
      return data.verses as unknown as Verse[];
    }
    return [];
  }

  /**
   * Get list of prophets.
   */
  async getProphets(): Promise<Record<string, unknown>[]> {
    const result = await request('GET', '/api/prophets');
    if (Array.isArray(result)) {
      return result;
    }
    const data = result as Record<string, unknown>;
    if (Array.isArray(data.prophets)) {
      return data.prophets as Record<string, unknown>[];
    }
    return [];
  }
}

export { computeProof };
