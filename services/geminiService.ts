
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppMode, PhotographyConfig } from "../types";

const SYSTEM_INSTRUCTION = `
ROLE DEFINITION:
You are MAGIC CLIK, a professional image-analysis and prompt-generation system.
Your task is to analyze an uploaded image and convert it into a precise, structured, and platform-agnostic prompt that can be used in ChatGPT, Gemini AI, and Grok AI.

You do NOT generate images.
You ONLY generate text prompts.

GLOBAL RULES (MANDATORY):
1. Prompt output language must ALWAYS be English.
2. Output must be one single plain-text block (no markdown, no bullet points).
3. The uploaded image is the absolute visual authority.
4. If text instructions conflict with the image, THE IMAGE MUST WIN.
5. Never invent identity details that are not visible.
6. Never contradict previous paragraphs.
7. Prompts must be deterministic, descriptive, and unambiguous.

PARAGRAPH LOCK DIRECTIVE:
You MUST output the final prompt in EXACTLY the number of paragraphs specified for the selected mode.
Each paragraph MUST be separated by ONE blank line.
You are FORBIDDEN to merge, split, reorder, rename, or omit paragraphs.
You are FORBIDDEN to add titles, labels, bullet points, or formatting.
Paragraph order is ABSOLUTE and FINAL.

MODE SELECTION LOGIC:
- PHOTOGRAPHY: Exactly 5 paragraphs.
- DIGITAL ART: Exactly 3 paragraphs.
- RESTORATION: Exactly 3 paragraphs.

NON-NEGOTIABLE PRIORITY RULE (MASTER):
1. MANUAL INPUT (highest authority)
2. USER MENU SELECTION
3. UPLOADED IMAGE ANALYSIS

SURGICAL FIX DIRECTIVE v6 (MASTER ENFORCEMENT):
1. IMMUTABLE START PHRASE: The final prompt MUST ALWAYS start with: 'create a new image from this image object'.
2. HARD IDENTITY LOCK: Verbatim lock: 'Use the uploaded image as the ONLY and ABSOLUTE identity reference. Preserve facial structure, proportions, bone structure, eyes, nose, mouth, jawline, skin tone, skin texture, hairstyle, hairline, and apparent age exactly as shown. Do NOT reinterpret, redesign, stylize, beautify, or replace the face. Do NOT generate a different person. The final image MUST be instantly recognizable as the same individual.'
3. MANUAL = ABSOLUTE AUTHORITY: If a field (Outfit, Pose, Background, Atmosphere) is set to Manual, IGNORE all image inference and automatic analysis. Use ONLY the manual text (refined for grammar, not meaning).
4. HIJAB MANUAL HARD FIX: Hijab state follows user selection exactly. Wearing Hijab -> 'wearing hijab'. Not Wearing Hijab -> 'not wearing hijab'. Negative Prompt MUST NOT contradict this.
5. CINEMATOGRAPHY FORCE-INJECTION: Shot Size, Camera Angle, and Aspect Ratio MUST be injected as literal terms (e.g., 'Close-up framing', 'Bird's-eye view angle', 'aspect ratio 16:9').
6. POSE, OUTFIT, AND ATMOSPHERE PURITY: No gender, physical traits, body shape, ethnicity, or age mentioned in P2 and P3.

SURGICAL DIRECTIVE – DIGITAL ART MODE v1 (STYLE-ONLY PURITY):
1. PHILOSOPHY: Style transfer only. MUST NOT define, infer, or describe: gender, ethnicity, age, body shape, clothing, fashion, accessories, pose, or gesture.
2. ABSOLUTE STYLE-ONLY RULE: Content MUST describe ONLY artistic style, medium, technique, color palette, lighting, and visual language. Mentioning people or body parts is STRICTLY FORBIDDEN.
3. MANUAL STYLE INPUT: If Style Input = Manual, manual style text is the SINGLE SOURCE OF TRUTH.
4. NEGATIVE PROMPT: Block identity alteration and character redesign.

SURGICAL DIRECTIVE – RESTORATION MODE v1 (HISTORICAL COLORIZATION LOCK):
1. PHILOSOPHY: Historical preservation process. Repair damage, recover detail, apply natural colorization. MUST NOT modernize, change era, or alter composition/identity.
2. MANDATORY FULL-SCENE COLORIZATION: If black-and-white, colorization is MANDATORY for the entire image (subjects, clothing, skin, background).
3. PERIOD-ACCURATE COLORS: Muted, soft, low-saturation. Avoid vivid modern colors.
4. NEGATIVE PROMPT: Block modern photo look, cinematic grading, and high saturation.

FINAL OUTPUT RULE:
Return ONLY the final prompt text. No explanations. No formatting. No commentary.
`;

export const generateAppPrompt = async (
  image: string,
  mode: AppMode,
  config: PhotographyConfig
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';
  const base64Image = image.split(',')[1];
  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Image,
    },
  };

  let userPrompt = '';

  if (mode === AppMode.PHOTOGRAPHY) {
    const isCouple = config.objectType === 'Couple';
    const isMale = config.gender === 'Male';
    
    // Hijab status handling
    const showHijabInfo = !isMale && !isCouple;
    const hijabText = config.hijab ? 'wearing hijab' : 'not wearing hijab';

    // Identity Mapping logic
    let identityMapping = '';
    if (isCouple) {
      if (config.gender === 'Male & Female') {
        identityMapping = 'Image 1 for the male subject, Image 2 for the female subject.';
      } else {
        identityMapping = 'Image 1 for the left subject, Image 2 for the right subject.';
      }
    }

    // Manual Fields Logic
    const outfitPrompt = config.outfitMode === 'Manual'
      ? (config.outfitManualText.trim() === '' ? "Outfit follows the uploaded image." : `Use ONLY this clothing description: ${config.outfitManualText}`)
      : "Analyze and describe clothing details (style, cut, color, fabric, accessories) from the image using non-gendered language.";

    const posePrompt = config.poseMode === 'Manual'
      ? (config.poseManualText.trim() === '' ? "" : `Use ONLY this pose description: ${config.poseManualText}`)
      : "Analyze and describe body pose and gestures from the image. If portrait, focus on gaze and head orientation. Use non-gendered language.";

    const backgroundPrompt = config.backgroundMode === 'Manual'
      ? (config.backgroundManualText.trim() === '' ? "" : `Use ONLY this background description: ${config.backgroundManualText}`)
      : "Analyze and describe environment, architecture, lighting, weather, and mood from the image. Use non-gendered language.";

    userPrompt = `
MODE: PHOTOGRAPHY
GENDER: ${config.gender}
HIJAB_STATUS: ${showHijabInfo ? hijabText : 'Not Applicable'}
OBJECT_COUNT: ${config.objectType}

TASK:
Analyze the uploaded image and generate a FINAL IMAGE-GENERATION PROMPT strictly following the v6 directives.

PARAGRAPH 1 – COMMAND & IDENTITY LOCK
Line 1: create a new image from this image object
Line 2: Use the uploaded image as the ONLY and ABSOLUTE identity reference. Preserve facial structure, proportions, bone structure, eyes, nose, mouth, jawline, skin tone, skin texture, hairstyle, hairline, and apparent age exactly as shown. Do NOT reinterpret, redesign, stylize, beautify, or replace the face. Do NOT generate a different person. The final image MUST be instantly recognizable as the same individual.
Line 3: State parameters: Gender: ${config.gender}, ${showHijabInfo ? `Hijab: ${hijabText}, ` : ''}Object Count: ${config.objectType}. ${identityMapping} ${isCouple ? "This image contains two locked subjects. Identity attributes must NEVER be swapped or blended." : ""}

PARAGRAPH 2 – OUTFIT + POSE + EXPRESSION
- Pose: ${posePrompt}
- Outfit: ${outfitPrompt}
- Expression: ${config.expression}
- CRITICAL: DO NOT mention gender, body shape, physical traits, ethnicity, or age. ${!config.hijab ? "DO NOT use words like 'hijab' or 'veil' in this paragraph." : ""}

PARAGRAPH 3 – BACKGROUND & ATMOSPHERE
- Background/Atmosphere: ${backgroundPrompt}
- Time of Day: ${config.timeOfDay}
- CRITICAL: DO NOT mention gender, body shape, physical traits, ethnicity, or age.

PARAGRAPH 4 – CINEMATOGRAPHY
Inject literally: Camera: ${config.cameraType}, Lens: ${config.lensType}, Filter: ${config.filter}, Style: ${config.sceneMood}. 
Framing: ${config.shotSize} framing, Angle: ${config.cameraAngle} view angle, Aspect Ratio: aspect ratio ${config.aspectRatio}.
Append quality line: high detail clarity, sharp focus, natural skin texture, balanced lighting, realistic color grading, no artificial blur.

PARAGRAPH 5 – NEGATIVE PROMPT
Explicitly forbid: face change, identity drift, gender change, extra people, AI beautification, and unrealistic artifacts.
${config.hijab ? "DO NOT include any prohibition of hijab/head-coverings." : "REMOVE any enforcement of hijab/head-coverings."}
`;
  } else if (mode === AppMode.DIGITAL_ART) {
    const stylePrompt = config.styleMode === 'Manual'
      ? (config.styleManualText.trim() === '' ? "Apply a neutral, non-descriptive artistic style." : `Use ONLY this artistic style description: ${config.styleManualText}`)
      : "Analyze and describe only the artistic style, line quality, color palette, medium, and rendering technique from the image.";

    userPrompt = `
MODE: DIGITAL ART
TASK: Generate a STYLE-ONLY transformation prompt.

PARAGRAPH 1 – COMMAND & IDENTITY LOCK:
Line 1: create a new image from this image object.
Line 2: Use the uploaded image as the ONLY and ABSOLUTE identity reference. Preserve facial structure, proportions, bone structure, eyes, nose, mouth, jawline, skin tone, skin texture, hairstyle, hairline, and apparent age exactly as shown. Do NOT reinterpret, redesign, stylize, beautify, or replace the face.

PARAGRAPH 2 – STYLE & DESIGN ANALYSIS (STYLE ONLY):
${stylePrompt}
- CRITICAL: DO NOT mention people, gender, body parts, clothing, fashion, pose, gesture, ethnicity, or age. Focus exclusively on visual aesthetics, medium, and technical rendering.

PARAGRAPH 3 – NEGATIVE PROMPT:
Block identity alteration, character redesign, clothing invention, accessory addition, and pose modification. Result must be strictly digital/artistic rendering.
    `;
  } else if (mode === AppMode.RESTORATION) {
    userPrompt = `
MODE: RESTORATION
TASK: Generate a historical preservation and colorization prompt.

PARAGRAPH 1 – RESTORATION COMMAND:
Line 1: create a new image from this image object.
Line 2: Use the uploaded image as the primary reference for historical restoration. Preserve all semantic content including facial structure, clothing, and environment.

PARAGRAPH 2 – DAMAGE ANALYSIS & MANDATORY COLORIZATION:
Identify scratches, noise, and blur for repair. Apply MANDATORY period-accurate, soft, muted colorization to the ENTIRE scene (subjects, skin, clothes, objects, background). Recover lost details while preserving the authentic photographic grain and lighting of the era.

PARAGRAPH 3 – NEGATIVE PROMPT:
No modern photographic looks, no high saturation, no cinematic color grading, no modernization of clothing or background, no face alteration, no object removal or addition.
    `;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { 
        parts: [
          imagePart, 
          { text: userPrompt }
        ] 
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        topP: 0.9,
      }
    });

    return response.text?.trim() || "Failed to generate prompt.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error occurred while processing the image. Please try again.";
  }
};
