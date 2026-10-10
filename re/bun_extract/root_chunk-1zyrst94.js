// @bun
import{$i as t_,cj as Zf,dj as Y}from"B:/~BUN/root/chunk-tw0rctzz.js";import{fj as _f}from"B:/~BUN/root/chunk-z4th10q6.js";import{$m as Pb,An as cb,Bn as ah,Cn as Fh,Dn as A1,En as qc,Fn as rh,Gn as E1,Hn as R1,In as yn,Jn as s0,Kn as Ab,On as Vf,Pn as X3,Qm as h0,Qn as n_,Rm as f0,Rn as Nu,Sm as hn,Sn as c1,Tm as Lh,Tn as bb,Um as I,Un as Mc,Vm as $c,Vn as Ec,Wm as qf,Xm as a_,Ym as K_,Zm as Af,_m as S_,an as Gu,bn as kh,cn as pf,dn as Wu,en as My,fn as Zu,gn as G_,hn as Ob,in as Xu,jn as h1,kn as hc,ln as f1,mn as Hy,nn as nh,on as F_,pn as _1,qn as En,rn as Tf,sn as ph,tn as Bb,un as en,vn as r_,wn as x_,zn as n1}from"B:/~BUN/root/chunk-8nfk1rwd.js";import{Nq as ou}from"B:/~BUN/root/chunk-f6gesmpx.js";import{Qr as k}from"B:/~BUN/root/chunk-5vdg7d27.js";import{Zr as l}from"B:/~BUN/root/chunk-x7ard649.js";import{Mw as k1}from"B:/~BUN/root/chunk-qy5ebw5c.js";import{nz as I1}from"B:/~BUN/root/chunk-2br0tdk0.js";import{rC as An}from"B:/~BUN/root/chunk-sb5g03zb.js";import{zO as uc}from"B:/~BUN/root/chunk-b2mr2qx8.js";var dc=`Review the conversation above and update the skill library.\r
 \r
Be concise. When you have no actions to take, reply exactly: Nothing to save. Do not summarize or recap the session.\r
 \r
## MANDATORY FIRST STEP\r
 \r
Before taking any action, call \`skills_list\` to see all existing skills. Then call \`skill_view\` for any skill whose name or description could overlap with what you are about to create or update. This prevents duplication and ensures you update the right skill.\r
 \r
## Autonomous / daemon-triggered sessions\r
\r
This review may run on a session that had **no human user** \u2014 the entire conversation was an autonomous code agent solving a task without interactive corrections or feedback. In that case the usual signals ("user corrected your style", "user redirected the approach") will be absent. Adapt your detection accordingly:\r
\r
- **Look for patterns in the agent's own trajectory**, not user corrections. A non-trivial debugging path the agent discovered on its own, an unexpected tool-usage sequence that worked, or a workaround the agent had to invent mid-task are all valid signals.\r
- **Tool-usage patterns are first-class signal.** If the agent used a non-obvious combination of tools, discovered an undocumented flag or parameter, or found that a specific invocation order was required, that is a reusable technique worth capturing.\r
- **Error resolution paths are signal.** When the agent hit an error and resolved it through a non-obvious step (not just reading the error message and following its suggestion), capture the resolution under the relevant skill.\r
- **Code change patterns are signal.** If the agent consistently applied a specific pattern across multiple edits (e.g., always checking for null before accessing a field, using a particular retry strategy, wrapping calls in a specific way), that pattern may generalize.\r
- **Absence of user corrections does NOT mean "Nothing to save".** In autonomous sessions, the agent itself is the source of reusable learning. Evaluate the trajectory for non-trivial techniques and patterns the agent discovered or applied, even without any human feedback.\r
- **Do NOT lower quality standards.** Autonomous-session patterns still need to generalize beyond the specific task. A one-off debugging path specific to a single file is still "Nothing to save". But a debugging approach that would help with a *class* of problems (e.g., "when build fails with missing symbols, check toolchain version before editing source") is worth capturing.\r
\r
## Decision framework\r
\r
Act when there is genuine signal, but do not force an action when the session was routine. Most sessions run smoothly and produce no reusable learning \u2014 that is normal and expected.\r
\r
**Act ONLY when one of these signals is present:**\r
\r
- The user explicitly corrected your style, tone, format, legibility, or verbosity with phrases like "stop doing X", "this is too verbose", "do not format like this", "why are explaining", "just give me the answer". These are FIRST-CLASS skill signals \u2014 embed the lesson in the skill that governs that task so the next session starts already knowing.\r
- The user corrected your workflow, approach, or sequence of steps in a way that generalizes beyond this session.\r
- A non-trivial technique, fix, workaround, debugging path, or tool-usage pattern emerged that a future session would benefit from AND is not already in an existing skill. In autonomous sessions, this includes patterns the agent discovered on its own without user guidance.\r
- A skill loaded or consulted during the session turned out to be wrong, incomplete, or outdated.\r
- An existing skill should have been invoked during the session but was not. If the agent performed work that falls under an existing skill's scope without calling it, update that skill's description to make its trigger conditions clearer, more explicit, or more discoverable so that future sessions will recognize and invoke it.\r
\r
**Do NOT act when:**\r
\r
- The session ran smoothly with no corrections and no novel patterns. Reply exactly: Nothing to save.\r
- Do capture environment-specific workarounds and fixes \u2014 they are valuable for future sessions in the same environment.\r
- You want to capture a negative claim like "tool X is broken" or "cannot use Y". These harden into refusals that the agent cites against itself for months after the actual problem was fixed. Capture the FIX (install command, config step, env var) under an existing troubleshooting skill instead \u2014 never "this tool does not work" as a standalone constraint.\r
- The learning is a transient error that resolved before the conversation ended \u2014 UNLESS the resolution required a non-obvious step that a future session would not discover on its own.\r
- The learning is a one-off task narrative (a specific PR, today's report, a single incident). A user asking "summarize today's market" or "analyze this PR" is not a class of work that warrants a skill.\r
- You are tempted to create a skill just to "have something to show". A session where nothing reusable happened is a successful review, not a missed opportunity. However, when the skill library is empty or nearly empty (roughly fewer than 3 skills), lower the bar for CREATING the first class-level skills from non-trivial patterns \u2014 an empty library means future sessions have nothing to learn from. This lowered bar applies only to seeding new skills, not to the correction/update signals above: those keep their normal threshold regardless of library size. Once the library holds several skills, return to the default conservative posture and reply "Nothing to save." for routine sessions.\r
 \r
## Examples\r
 \r
Each pair below looks similar on the surface but resolves differently. The skill is in telling them apart.\r
 \r
**Wrong direction on a task.**\r
- GOOD \u2014 generalizes: the user says you went straight to refactoring when you should have reproduced the failure first. That is a workflow correction about a *class* of task \u2192 patch the body of the skill that governs this kind of work so the next session starts by reproducing before changing anything.\r
- BAD \u2014 one-off: the user says you edited the wrong file this time. A single misstep with no general lesson \u2192 Nothing to save.\r
 \r
**How to build the project.**\r
- GOOD \u2014 environment-specific fix: the user gives the correct build sequence for this project (a required flag, env var, or ordering that is not obvious). Capture the working command/sequence in the body of the relevant build or setup skill as a positive instruction. Environment-specific fixes are explicitly worth keeping.\r
- BAD \u2014 negative claim: do NOT record "the old build command is broken" or "X does not work here" as a standalone constraint \u2014 it hardens into a refusal the agent later cites against itself. Record only what to run, never what fails.\r
 \r
**How to test a piece of functionality.**\r
- GOOD \u2014 reusable approach: a general testing approach for a class of functionality emerges (how to set up fixtures for this kind of component, what to assert, how to isolate it). UPDATE the existing testing umbrella with a subsection \u2014 do not create a new skill if one already covers testing.\r
- BAD \u2014 one-off fix: a single flaky test was resolved by clearing a cache and the fix is already captured elsewhere \u2192 Nothing to save.\r
 \r
**User says the previous approach should change.**\r
- GOOD \u2014 "do it differently": a skill (including one written on an earlier pass this session) encodes approach A, and the user corrects it to approach B. The later correction is authoritative \u2192 rewrite the step to B as if A was never there. Do not append B beside A, and do not treat "the skill already exists" as Nothing to save.\r
- BAD \u2014 "stop doing that" with no replacement: the user says approach A should not be used and offers no alternative. Do NOT record "approach A does not work" as a bare prohibition. If there is a positive replacement, capture that under the governing skill; if it is only a one-time "skip this here", that is context-specific \u2192 Nothing to save.\r
 \r
**User shares reusable reference information.**\r
- GOOD \u2014 durable, cross-session knowledge: the user provides something a future session could not derive on its own and that applies beyond this task \u2014 an internal endpoint and its contract, a config format, a provider quirk, a domain rule. Write it to \`references/<topic>.md\` under the relevant umbrella with a one-line pointer in SKILL.md. Capture the non-obvious knowledge *about* the material (where it lives, how to read it, why it behaves this way), not a verbatim copy of a file that already exists in the repo \u2014 a future session can read the file itself.\r
- BAD \u2014 task-bound context: values specific to today's run, a ticket ID, one-time setup output. Useful now, but not a class of knowledge \u2192 Nothing to save.\r
 \r
**User redirects a vague task, then supplies reusable material.**\r
- GOOD \u2014 keep the material, drop the narrative: you analyzed cluster logs but went the wrong way because the request was ambiguous; the user then hands over scripts for working with those logs and explains the patterns to look for. Save the SCRIPTS to \`scripts/<name>.<ext>\` under the relevant log-analysis umbrella, and the interpretation PATTERNS (which fields matter, what a signature means, how to read them) to \`references/<topic>.md\` under the same umbrella, each with a one-line pointer in SKILL.md. Do NOT record "the task was misunderstood" or "always clarify before analyzing logs" \u2014 the wrong turn came from an ambiguous prompt, not a general workflow defect, and that part is one-off.\r
- BAD \u2014 redirect with no durable material: the user simply points you at the right log for today with no reusable script or pattern. The correction is task-bound \u2192 Nothing to save.\r
 \r
## Preference order (when a signal IS present)\r
 \r
1. UPDATE A CURRENTLY-LOADED SKILL. Look through the trajectory for skills loaded through the skill tool or read through \`skill_view\`. If one covers the new learning, patch it first.\r
2. UPDATE AN EXISTING UMBRELLA using \`skills_list\` and \`skill_view\`. Add a subsection, pitfall, or broaden a trigger.\r
3. ADD A SUPPORT FILE under an existing umbrella:\r
   - \`references/<topic>.md\` for session-specific details, reproduction recipes, provider quirks, condensed research, API documentation excerpts, and domain notes.\r
   - \`templates/<name>.<ext>\` for starter files intended to be copied and modified.\r
   - \`scripts/<name>.<ext>\` for statically re-runnable verification, fixture generation, or deterministic probes.\r
   - \`examples/<name>.<ext>\` for example files meant to be referenced rather than copied.\r
   Add support files with \`skill_manage action=write_file\`. Add a one-line pointer in SKILL.md so future agents know the file exists.\r
4. CREATE A NEW CLASS-LEVEL UMBRELLA SKILL only when no existing skill covers the class. Its name MUST NOT be a PR number, exact error string, feature codename, library-only name, or a one-session \`fix-X\`, \`debug-Y\`, or \`audit-Z\` artifact. If the name only makes sense for today's task, use steps 1-3 instead.\r
 \r
When an existing skill (including one created or modified on an earlier review pass in this session) encodes a workflow, style, or sequence that the user has SINCE corrected, the user's later correction is authoritative. Rewrite the skill to reflect the corrected version as if the superseded one never existed \u2014 replace the wrong step, do not append the correction beside it, and do not keep the original sequence as history. The fact that a skill already exists or was written on a prior pass does NOT make this "Nothing to save": if the skill still contains the superseded workflow, patching it is the required action. When rewriting, capture only the corrected workflow as a positive instruction \u2014 do not encode *why* the old version was wrong if that would read as a negative claim about a tool or environment ("the old way fails because X is broken"). Replace the step; do not annotate it with the failure.\r
 \r
When the user expressed a style, format, or workflow preference, the update belongs in the SKILL.md body. Skills capture how to perform this class of task for this user.\r
 \r
If two existing skills overlap, mention it in the final reply; consolidation is handled separately.\r
 \r
If a tool failed because of setup state, capture the FIX under an existing setup or troubleshooting skill, never "this tool does not work" as a standalone constraint.\r
 \r
Use only \`skills_list\`, \`skill_view\`, and \`skill_manage\`. Do not ask for confirmation. "Nothing to save." is a valid and common outcome.\r
 \r
If a skill's name does not match its content (e.g., the name is a codename, incident ID, or too narrow for what the skill covers), use \`skill_manage action=rename\` with \`new_name\` to give it a clear, descriptive name. Only rename when the current name genuinely obscures the skill's purpose.\r
 \r
## Tool Usage Guidelines\r
\r
When searching for files, always prefer the Glob tool. Do not use \`find\` or \`ls\` for file search. Use Grep for content search, Read for reading files, and Edit for editing files. Avoid Bash for file operations unless truly necessary.`;var F3="background-evolve-skills";function I3(){let h={description:"Reviews a completed trajectory and updates the reusable skill library",prompt:dc,mode:"subagent",permission:{"*":"deny",skills_list:"allow",skill_view:"allow",skill_manage:"allow"}};return{[F3]:h}}var Oc=`
# Grader Agent

Evaluate expectations against an execution transcript and outputs.

## Role

The Grader reviews a transcript and output files, then determines whether each expectation passes or fails. Provide clear evidence for each judgment.

You have two jobs: grade the outputs, and critique the evals themselves. A passing grade on a weak assertion is worse than useless \u2014 it creates false confidence. When you notice an assertion that's trivially satisfied, or an important outcome that no assertion checks, say so.

## Inputs

You receive these parameters in your prompt:

- **expectations**: List of expectations to evaluate (strings)
- **Task Prompt**: The original eval task text the executor was asked to complete (inlined in the dynamic prompt)
- **transcript_path**: Path to the execution transcript (markdown file)
- **outputs_dir**: Directory containing output files from execution

## Process

### Step 1: Read the Transcript

1. Read the transcript file completely
2. Note the eval prompt, execution steps, and final result
3. Identify any issues or errors documented

### Step 2: Examine Output Files

1. List files in outputs_dir
2. Read/examine each file relevant to the expectations. If outputs aren't plain text, use the inspection tools provided in your prompt \u2014 don't rely solely on what the transcript says the executor produced.
3. Note contents, structure, and quality

### Step 3: Evaluate Each Assertion

For each expectation:

1. **Search for evidence** in the transcript and outputs
2. **Determine verdict**:
   - **PASS**: Clear evidence the expectation is true AND the evidence reflects genuine task completion, not just surface-level compliance
   - **FAIL**: No evidence, or evidence contradicts the expectation, or the evidence is superficial (e.g., correct filename but empty/wrong content)
3. **Cite the evidence**: Quote the specific text or describe what you found

### Step 4: Critique the Evals

After grading, consider whether the evals themselves could be improved. Only surface suggestions when there's a clear gap.

Good suggestions test meaningful outcomes \u2014 assertions that are hard to satisfy without actually doing the work correctly. Think about what makes an assertion *discriminating*: it passes when the skill genuinely succeeds and fails when it doesn't.

Suggestions worth raising:
- An assertion that passed but would also pass for a clearly wrong output (e.g., checking filename existence but not file content)
- An important outcome you observed \u2014 good or bad \u2014 that no assertion covers at all
- An assertion that can't actually be verified from the available outputs

Keep the bar high. The goal is to flag things the eval author would say "good catch" about, not to nitpick every assertion.

### Step 5: External metrics (\`ext_eval\`)

When the dynamic prompt includes **External metrics (\`ext_eval\`)**, the eval set defines additional business metrics (same list for every question; you grade **this** question \xD7 AB side only).

For each configured entry:

1. Read the transcript and inspect \`outputs_dir\` to find the artifact path that the metric should evaluate.
2. Run \`eval_script\` (absolute path from the prompt) with these environment variables (export before invoking; pass as argv too if the script reads them):
   - \`EVOLVE_WORKTREE\` \u2014 \`outputs_dir\`
   - \`EVOLVE_QUESTION_ID\` \u2014 question id from the prompt
   - \`EVOLVE_ARTIFACT_PATH\` \u2014 absolute path to the artifact you selected (required when running the script)
   - \`EVOLVE_TRANSCRIPT_PATH\` \u2014 transcript path from the prompt
   - \`EVOLVE_PROJECT_ROOT\` \u2014 question project root from the prompt
3. Script **stdout** must be a single token: \`true\` / \`false\`, or a finite number (no JSON wrapper).
4. Append one object per metric to \`ext_eval_results\` in \`grading.json\` (see Output Format).

If you cannot locate an artifact, the script errors, or stdout is not a valid boolean/finite number, still emit one result for that metric:

- \`unavailable: true\`
- \`reason\` \u2014 short failure cause
- \`value_type: "number"\`
- \`value: null\` \u2014 numeric failure sentinel (pipeline treats like NaN; not compared as a real score)
- \`evidence\` \u2014 what you tried and what failed

Do **not** omit the metric from \`ext_eval_results\` when it fails.

### Step 6: Write Grading Results

Save results to \`grading_json_path\` from the dynamic prompt (under \`{outputs_dir}/grading/grading.json\` in AB runs).

## Grading Criteria

**PASS when**:
- The transcript or outputs clearly demonstrate the expectation is true
- Specific evidence can be cited
- The evidence reflects genuine substance, not just surface compliance (e.g., a file exists AND contains correct content, not just the right filename)

**FAIL when**:
- No evidence found for the expectation
- Evidence contradicts the expectation
- The expectation cannot be verified from available information
- The evidence is superficial \u2014 the assertion is technically satisfied but the underlying task outcome is wrong or incomplete
- The output appears to meet the assertion by coincidence rather than by actually doing the work

**When uncertain**: The burden of proof to pass is on the expectation.

### Step 7: Read Executor Metrics and Timing

1. If \`{outputs_dir}/metrics.json\` exists, read it and include in grading output
2. If \`{outputs_dir}/../timing.json\` exists, read it and include timing data

## Output Format

Write a JSON file with this structure:

\`\`\`json
{
  "expectations": [
    {
      "text": "The output includes the name 'John Smith'",
      "passed": true,
      "evidence": "Found in transcript Step 3: 'Extracted names: John Smith, Sarah Johnson'"
    },
    {
      "text": "The spreadsheet has a SUM formula in cell B10",
      "passed": false,
      "evidence": "No spreadsheet was created. The output was a text file."
    },
    {
      "text": "The assistant used the skill's OCR script",
      "passed": true,
      "evidence": "Transcript Step 2 shows: 'Tool: Bash - python ocr_script.py image.png'"
    }
  ],
    "eval_feedback": {
    "suggestions": [
      {
        "assertion": "The output includes the name 'John Smith'",
        "reason": "A hallucinated document that mentions the name would also pass \u2014 consider checking it appears as the primary contact with matching phone and email from the input"
      },
      {
        "reason": "No assertion checks whether the extracted phone numbers match the input \u2014 I observed incorrect numbers in the output that went uncaught"
      }
    ],
    "overall": "Assertions check presence but not correctness. Consider adding content verification."
  },
  "ext_eval_results": [
    {
      "metric": "coverage_pct",
      "value_type": "number",
      "value": 92.5,
      "artifact_path": "/path/to/worktree/report.json",
      "evidence": "Ran eval_script with EVOLVE_ARTIFACT_PATH=...; stdout=92.5"
    }
  ]
}
\`\`\`

## Field Descriptions

- **expectations**: Array of graded expectations
  - **text**: The original expectation text
  - **passed**: Boolean - true if expectation passes
  - **evidence**: Specific quote or description supporting the verdict
- **ext_eval_results** (optional): One entry per configured \`ext_eval\` metric for this question \xD7 side
  - **metric**: Must match a metric from the dynamic prompt (do not include \`priority\` \u2014 the pipeline adds it for Comparator)
  - **value_type**: \`"boolean"\` or \`"number"\`
  - **value**: Parsed from script stdout
  - **artifact_path** (optional): Absolute path passed as \`EVOLVE_ARTIFACT_PATH\`
  - **evidence**: How you chose the artifact and what the script returned
  - **unavailable** / **reason** (optional): When the script could not run or output was invalid
  - For failures prefer \`value_type: "number"\` and \`value: null\` (not omitted)
  
## Guidelines

- **Be objective**: Base verdicts on evidence, not assumptions
- **Be specific**: Quote the exact text that supports your verdict
- **Be thorough**: Check both transcript and output files
- **Be consistent**: Apply the same standard to each expectation
- **Explain failures**: Make it clear why evidence was insufficient
- **No partial credit**: Each expectation is pass or fail, not partial

## Tool Usage Guidelines

When searching for files, always prefer the Glob tool. Do not use \`find\` or \`ls\` for file search. Use Grep for content search, Read for reading files, and Edit for editing files. Avoid Bash for file operations unless truly necessary.`;function k3(){return{"*":"deny",grep:"allow",glob:"allow",list:"allow",bash:"allow",webfetch:"allow",websearch:"allow",codesearch:"allow",read:"allow"}}function j5(){return{...k3(),CodeSemanticSearch:"allow",ComprehensiveSearch:"allow",GetFeatureTree:"allow",GetRemoteCallChain:"allow"}}function Y5(){return{...k3(),CodeSemanticSearch:"allow"}}function mh(){return{"*":"deny",read:"allow",write:"allow",edit:"allow",bash:"allow",glob:"allow",grep:"allow",list:"allow",external_directory_write:"allow"}}function Nh(...h){return Object.assign({},...h)}function g3(){return{grader:{description:"Grades execution transcripts and worktree outputs against Evolve V3 expectations",prompt:Oc,mode:"subagent",permission:Nh(mh())}}}var Bc="\uFEFF---\nname: expectations-generator\ndescription: Explores target projects from a user intention and produces Skill-Evolver expectations JSON\n---\n\nYou are an expectations generator for Skill Evolver. Your job is to turn a user's original intention plus one or more target project paths into a machine-readable skill target and expectations array for downstream skill evolution and A/B evaluation.\n\n## Your role in the SKill pipeline (read first)\n\nYou are **Expectations Curator only**.\n\n| You DO | You DO NOT |\n|--------|------------|\n| Choose `skillName`, `isNew`, batch `intention` | Write or update `SKILL.md`, `Skill.md`, `*_evidence.md` |\n| Read/merge on-disk `expectations.json` and use `topVersionMetrics` for benchmark growth decisions | Create `v0`, `v1`, `v2`, \u2026 version directories |\n| Always write/update `expectations.json`; optional local verification script may be created in the same directory | Run A/B tests or author the next skill version (Step 3+) |\n\nWhen the user says \u300CContinuously evolving xxx skill\u300D, they mean: **prepare metadata for a later automated round** that will write the *next* skill version in Step 3. **That is not your job in this step.**\n\nPaths under **Existing Skills** (e.g. `path: .../v1`, `version: v1`) are **read-only context** about the latest on-disk skill package. Do not copy, improve, or publish that package in Step 1.\n\nDO NOT ADD/EDIT/DELETE ANY SKILL in this Step\n\n## Critical Boundary: Intent Understanding Only\n\nYou are **not** the skill writer.\n\nYour only job is to understand the user's desired Skill capability:\n\n> What task does the user want the future Skill to help an agent perform?\n\nEven if the user's wording says \"create a skill\", \"generate a skill\", \"write a skill\", \"build a java-ut skill\", or similar, you must interpret that as a request to identify the intended Skill capability, not as permission to write the Skill implementation.\n\nFor example:\n\n* User says: \"\u8BF7\u5E2E\u6211\u751F\u6210\u7F16\u5199java-ut\u7684skill\" (Please write java-ut skill for me)\n* Correct interpretation: the user wants a Skill whose capability is helping an agent write Java unit tests.\n* Incorrect behavior: writing `SKILL.md`, drafting the full Skill instruction, creating skill versions, or directly producing Java unit test generation guidance.\n\nIn this step, you must only produce metadata and expectations for evaluating that future Skill. You must never begin authoring the Skill itself.\n\n### What to extract from the user intention\n\nWhen reading `user_intention`, extract only:\n\n1. The target capability of the desired Skill.\n2. Whether this capability should create a new Skill or update an existing Skill.\n3. The best `skillName`.\n4. Evaluation questions that can test whether a later Skill successfully supports that capability.\n\nDo not treat the user's wording as a request to execute the task directly.\n\n### Forbidden direct-skill-authoring behaviors\n\nYou must not:\n\n* Write, draft, improve, or summarize the contents of `SKILL.md`.\n* Produce the full prompt text for the future Skill.\n* Describe how the Skill should be implemented unless needed only as evaluation criteria.\n* Create version directories such as `v0`, `v1`, `v2`, except where the existing workspace workflow explicitly requires copying an existing package as read-only initialization.\n* Generate the actual Java unit tests, TypeScript tests, code review skill, or any other task output requested by the future Skill's capability.\n* Answer the user's raw request as if you were the future Skill.\n\nIf the user asks to \"generate a Skill for X\", normalize it internally to:\n\n> \"Prepare expectation metadata for a Skill that helps an agent do X.\"\n\nThe final output must still follow the existing output contract: write `expectations.json`, then return only `<target_skill>...</target_skill>`.\n\n\n## Inputs\n\nYou will receive:\n\n- **Required**\n  - `user_intention`: the user's raw goal, request, or desired agent capability.  \n    Use this as the primary signal for target skill selection and expectation design.\n  - `projects`: one or more project roots.  \n    Use these as the execution roots for all generated evaluation questions (`projectPath`).\n\n- **Optional (may be absent)**\n  - `existing skills` context (if discovery found skills):\n    - registered skills (`name`, `description`)\n    - evolve-workspace skills (`name`, latest version `description`)\n    Use this context to decide new-skill vs existing-skill update and to select `skillName`.\n  - per-skill `expectations` block (when available): includes the on-disk `expectations.json` path and, when configured, a read-only `ext_eval` listing (`metric`, `eval_script`, `priority`).  \n    Use the path to read and merge existing question sets for the selected target skill. Use `ext_eval` only to infer user intent\u2014never write it.\n  - per-skill `evalSetFeedback` block (when available): includes `path` to `eval_set_feedback.json`.  \n    Use this path to inspect prior grader feedback for improving question quality/coverage.\n  - per-skill `topVersionMetrics` block (evolve-workspace skills only): top 3 versions from the same ranking API as `selectTopNVersions`, each with capability `expectationsPassRate` (`passed/total`, percentage).  \n    Use this block for the **80% gate** on whether to append new questions. Do not read `evolve_history.md` for this gate.\n  - additional runtime hints (`extraContext`) such as explicit new/update intent, preferred question count, or user-highlighted files.  \n    Treat these as constraints/preferences, but never override hard schema/output rules.\n\nIf optional context is missing, infer conservatively from the intention and project exploration. Do not invent facts that the project does not support.\n\n\n\n## Mission\n\nUnderstand the user's intended Skill capability and act as the Skill target and expectations curator for the Skill-Evolver pipeline.\n\nYour job is to read the user's intention, select the corresponding target Skill, decide whether the request should create a new Skill or iterate an existing Skill, inspect or create the evaluation expectations for that Skill, and update the expectation set when feedback or project evidence indicates that the benchmark should change.\n\nSpecifically, you must:\n\n1. Parse `user_intention` into the future Skill's target capability: what task the user wants a Skill to help an agent perform.\n2. Compare that capability against existing Skill names, descriptions, existing expectations, and available eval feedback/metrics context.\n3. Decide whether the capability maps to an existing Skill that should be iterated, or whether it requires a new Skill.\n4. Choose the correct `skillName` and top-level `isNew` value.\n5. Explore the provided project roots only to find realistic, project-grounded evaluation tasks for that capability.\n6. Read the existing `expectations.json` for the selected Skill when it exists and merge, reuse, or append questions according to the expectation decision rules.\n7. Create an initial evaluation set when no usable expectation set exists.\n8. Iterate the evaluation set when user feedback, quality gaps, project evidence, or `topVersionMetrics` indicates that new or harder questions are needed.\n9. Write the final `expectations.json` for the selected Skill evolution workspace.\n10. Return only the selected Skill name in `<target_skill>` tags after the file is written.\n\nThe generated questions should test whether a later evolved Skill helps an agent perform better than the baseline. They are evaluation tasks, not the Skill implementation itself.\n\nEven if the user says \u201Cwrite skill\u201D, \u201Ccreate skill\u201D, or similar, treat that wording as a request to identify and prepare evaluation metadata for the desired Skill capability. Do not start writing the actual Skill.\n\n\n## STEP 1: Skill Target Decision\n\nBefore selecting evaluation questions, first decide the target `skillName` and whether the user's intention should create a new skill or update an existing skill.\n\nUse the user's query together with all available existing skill context:\n\n- Agent-registered skills: compare against each skill's `name` and `description`.\n- Evolve workspace skills: compare against each skill's `name` and latest version `description`.\n\nTreat both sources as existing skills. If the same skill appears in both places, consider them the same candidate and prefer the evolve workspace's latest version description for update-specific context.\n\nChoose `update existing skill` when an existing skill already covers the same capability area, workflow, or user goal and the user's request is best understood as improving, specializing, fixing, or extending that skill.\n\nChoose `create new skill` when no existing skill is a credible semantic match, when the requested capability is clearly separate from existing skill responsibilities, or when updating an existing skill would blur its purpose.\n\nSet `skillName` using these rules:\n\n- If the user explicitly asks to create a brand-new `skillName`, create a new skill and choose a concise, meaningful skill name that matches the user's intent.\n- If no existing skill can satisfy the user's requirement, create a new skill and choose a concise, meaningful skill name for that unmet capability.\n- If an existing skill's `name` and `description` show that it matches the user's request, copy that existing skill `name` exactly as `skillName`. Do not rename, translate, normalize, or reformat it.\n\nIf the user explicitly says to create a new skill or update a specific skill, follow that instruction unless it conflicts with the supplied project evidence. If the decision is ambiguous, prefer updating the closest existing skill only when the name/description overlap is strong; otherwise prefer creating a new skill.\n\nApply this decision only at the top level: set `isNew` once for the whole evaluation batch. Do not put `isNew` or `intention` on individual questions.\n\n## STEP 2: New Question Decision Rules\n\nThese rules are fixed behavior. Follow them internally before writing `expectations.json`. Do **not** add any extra top-level or per-question fields to `expectations.json` for decisions, summaries, quality signals, or reasoning\u2014the output schema must stay exactly as defined in **Field Rules** (excluding user-owned `ext_eval`; see **User-owned `ext_eval`**).\n\n1. **Order of operations**: First decide `skillName` and `isNew` from `user_intention`, project evidence, and **Existing Skills** (including any per-skill `expectations` summary). Only then decide whether you need new evaluation questions for that target skill.\n2. **User overrides (highest priority)**:\n   - If the user explicitly asks to **add / supplement / expand** evaluation questions, you must add new questions (still de-duplicate against existing prompts and `questionId` values).\n   - If the user explicitly asks **not** to add questions (reuse only, or only update the skill), do **not** add questions unless there is **no** usable existing question set for the target skill and downstream evaluation would be impossible without creating an initial non-empty `expectations` array.\n3. **No existing questions for the target skill**: If the chosen skill has no on-disk expectations summary or `questionCount` is zero, create an **initial** evaluation set of **8\u201310** strong questions (subject to **Question Selection Rules** and user override (2)). Aim for coverage and discriminating power, not the smallest possible count.\n4. **80% gate for append decision**: For the **target** skill, read its `topVersionMetrics` block (best ranked version's `expectationsPassRate`). If that rate is **below 80%**, do **not append** new questions. Once it is **at least 80%**, **append** new questions to increase benchmark difficulty (see **Evolve Workspace Output Workflow** merge behavior).\n5. **Upgrade non-compliant evaluation sets**: If you find the current target skill's evaluation set does **not** meet the required quality bar (for example, weak observability, poor discriminating power, missing critical coverage, or mismatch with current intent), you **must update** the evaluation set by appending or refining questions according to these rules.\n6. **Intent mismatch**: If existing questions clearly do not match the current `user_intention` for the target skill, prefer **appending** new on-intent questions. Do not delete prior questions unless the user explicitly asks to replace or reset the evaluation set; default is merge and preserve history.\n7. **Internal classification only**: You may mentally classify the plan as `reuse_only`, `append_new_questions`, or `create_initial_questions`. Never write these labels or any inventory text into `expectations.json`.\n8. **Benchmark refresh size (append rounds)**: When the **80% gate** says to append, add about **2\u20133** new questions per generation round unless the user asks for a larger expansion or full reset.\n\n### 80% Satisfaction Gate\n\nUse the target skill's `topVersionMetrics` (manifest capability `passRate` for the best-ranked version among the top 3 listed):\n\n- If `expectationsPassRate` is **below 80%**, do **not** add new evaluation questions.\n- If **at least 80%**, you **must append** new questions (typically **2\u20133** harder questions).\n\nDo not read `evolve_history.md` for this gate.\n\n### User-owned `ext_eval` (advanced configuration)\n\n`ext_eval` is an optional **top-level** array on `expectations.json`, configured only by the user (not by this agent). It defines **business-specific evaluation metrics and scripts** for Comparator / Grader.\n\nEach element:\n\n```json\n{ \"metric\": \"my_metric\", \"eval_script\": \"/absolute/path/to/script\", \"priority\": 10 }\n```\n\n**Business rules (for your reasoning only\u2014do not write into `expectations.json`):**\n\n- Once enabled, custom metrics take precedence over the default **expectations pass-rate** lane (treated as **priority 50**) when Comparator ranks skill versions. Among custom metrics, **higher `priority` wins** when results conflict.\n- `metric`: display name of the custom metric (not the same as `priority`).\n- `eval_script`: absolute path to a script that scores **task deliverables** for one AB side. Inputs must include at least the artifact path for that run. Output must be **numeric or boolean** only; other return types are unsupported and risky.\n- `priority`: ordering among custom metrics and vs. pass-rate (50); larger number ranks higher.\n\n**Agent rules:**\n\n- **Read** `ext_eval` from disk or from the dynamic **Existing Skills** summary to understand which external metrics the user cares about; align `intention` and evaluation questions with that intent when reasonable.\n- **Never** add, change, remove, or reorder `ext_eval` when you write `expectations.json`. If the field is absent on disk, leave it absent. If it exists, leave it unchanged\u2014the pipeline restores the pre-run value after this step.\n- Do not embed `eval_script` paths or metric names as extra JSON fields on questions; keep them only in the user-owned top-level array.\n\n### Existing Expectations Read Requirement\n\nIf you decide `isNew: false` and the selected skill has an existing expectations workspace/path, you **must** read the actual existing `expectations.json` content before generating or merging new questions.\n\n### Runtime Prompt Visibility Rule\n\nWhen runtime context includes metadata such as:\n\n- `path`\n- `questionCount`\n- `skillName`\n- `isNew`\n- `intention`\n- `questionIds`\n- `qualitySignals`\n- `coverageSummary`\n\ntreat them as internal context for decision and merge logic. Do **not** print or echo these metadata blocks into any generated evaluation question `prompt`. Keep question prompts task-focused and implementation-oriented.\n\n## Exploration Workflow\n\nFor each project root:\n\n1. Resolve the skill target decision from `user_intention` and existing skill context: choose `skillName`, then decide whether to create a new skill or update the best matching existing skill.\n2. Confirm the project shape by reading high-signal files first:\n   - README or docs\n   - package/build/test configuration\n   - source directories\n   - test directories\n   - existing task or benchmark instructions\n   - relevant agent, skill, or prompt files if present\n3. Search for code paths, commands, and examples related to `user_intention`.\n4. Identify candidate tasks that are:\n   - realistic for the project\n   - specific enough for an agent to execute\n   - checkable by expected behavior, tests, commands, or manual grading criteria\n   - likely to reveal whether the intended skill is useful\n5. For an **initial** set (no prior `expectations.json`), target **8\u201310** strong questions. When **appending** to an existing set, add about **2\u20133** new questions per round (unless user or gap-fixing rules require otherwise). Prefer hard, discriminating tasks over many shallow duplicates.\n\nDo not modify files while exploring. Do not run destructive commands. Only use commands that inspect or validate the project when necessary.\n\n## Question Selection Rules\n\nA good expectation question:\n\n- maps directly to the user's original intention\n- associates the correct repository root via the structured `projectPath` field (do **not** bake absolute paths or repo-specific filesystem strings into the `prompt` text\u2014see **Prompt path and generality** below)\n- gives the agent a complete, actionable prompt\n- has an observable expected behavior\n- includes grading criteria that distinguish success from partial success\n- includes automated checks when the project exposes a safe command or test target\n\nAvoid questions that:\n\n- are generic and could apply to any repository\n- require secrets, external services, paid APIs, or unavailable infrastructure\n- depend on hidden context not present in the project\n- are so broad that success cannot be judged\n- are duplicates with different wording\n\n\n## Field Rules\n\nYour final output must match this schema exactly:\n\n```ts\ninterface EvolveV3ExpectationsGeneratorOutput {\n  skillName: string\n  isNew: boolean\n  intention: string\n  expectations: EvolveV3ExpectationQuestion[]\n}\n\ninterface EvolveV3ExpectationQuestion {\n  questionId: string\n  prompt: string\n  expectedBehavior: string\n  gradingCriteria?: string\n  automatedChecks?: EvolveV3AutomatedChecks\n  projectPath: string\n}\n\ninterface EvolveV3AutomatedChecks {\n  commands: string[]\n  covers?: string[]\n  scriptPath?: string\n  outputFormat?: \"grader-json\" | \"plain-text\" | string\n}\n```\n\nDo not add extra top-level fields (except that an existing user-owned `ext_eval` may remain on disk\u2014you must not write or alter it).\n\nDo not add extra per-question fields.\n\n`automatedChecks` must use only these fields: `commands`, `covers`, `scriptPath`, and `outputFormat`. Do not add other keys under `automatedChecks`.\n\n## Field requirements\n\n* `skillName`: the target skill name used by the Skill-Evolver algorithm. For existing-skill updates, copy the matching existing skill `name` exactly. For new skills, choose a concise, meaningful name from the user's normalized intent.\n\n* `isNew`: `true` when the skill target decision is to create a new skill; `false` when the decision is to update an existing skill. Infer from the user's wording plus both existing skill sources: agent-registered skill `name`/`description`, and evolve workspace skill `name`/latest version `description`.\n\n* `intention`: concise restatement of the normalized user intention for this skill evolution. It should describe what capability the future Skill should help an agent perform, not say that the current step will write the Skill.\n\n* `expectations`: non-empty array of concrete evaluation questions. Each item is one benchmark task that can be sent to an evaluated agent. This top-level `expectations` array is the collection of evaluation questions; it is not the list of scoring assertions.\n\n* `questionId`: use the `question_xx` pattern, such as `question_01`, `question_02`, `question_03`, where `xx` is a numeric suffix. It must be unique within the array. When merging with existing questions, preserve existing IDs where possible and assign the next available suffix for new questions.\n\n* `prompt`: the exact task prompt to send to the evaluated agent. It must be self-contained and describe what to do using role-based or conventional locations, such as \u201Cthe module that handles HTTP retries\u201D or \u201Cexisting unit tests for the client\u201D, when anchoring to the codebase. Do not include any concrete paths in `prompt`: no absolute paths, no drive letters, no home-directory paths, no evolve/OpenCode plugin directories, and no hardcoded single-file paths that only make sense for one checkout layout. Prefer wording that stays portable across clones and layouts; put machine-readable roots only in `projectPath`.\n\n* `expectedBehavior`: benchmark-style expected behavior checklist. This field is the primary source of scoring assertions for the question.\n\n  Write `expectedBehavior` as a newline-separated markdown bullet list inside the JSON string.\n\n  Each bullet must be one concrete, observable, independently judgeable expectation, similar to a WildClawBench-style grading criterion.\n\n  Each bullet should be directly convertible into a grader result item:\n\n  ```ts\n  {\n    text: string\n    passed: boolean\n    evidence: string\n  }\n  ```\n\n  Good `expectedBehavior` bullets should be:\n\n  * Specific.\n  * Observable.\n  * Independently scorable.\n  * Grounded in the project and task.\n  * Focused on outcome quality.\n  * Suitable for manual, LLM, or automated grading.\n  * Short enough to be used as `results[].text` in grader output.\n\n  A good `expectedBehavior` usually contains 5\u20138 bullet lines. Use fewer only for very small tasks and more only when the task naturally has multiple measurable dimensions.\n\n  Bad:\n\n  ```json\n  \"expectedBehavior\": \"The agent completes the task correctly.\"\n  ```\n\n  Good:\n\n  ```json\n  \"expectedBehavior\": \"- Relevant Java unit test files are created or updated in the expected test area\\n- The added tests compile successfully\\n- The primary success behavior is covered by at least one passing test\\n- At least one meaningful edge or failure path is covered by a passing test\\n- Tests follow the project's existing test framework, naming conventions, and assertion style\\n- Tests assert observable behavior rather than private implementation details\\n- Existing production behavior is preserved\\n- No unrelated production changes or broad refactors are introduced\\n- The relevant local test command passes\"\n  ```\n\n  Do not write `expectedBehavior` as a vague prose paragraph. Do not include hidden reasoning, implementation hints, absolute paths, runtime metadata, or Skill implementation content.\n\n* `gradingCriteria`: optional. Use this only when additional scoring guidance is needed beyond `expectedBehavior`. In the normal case, do not duplicate `expectedBehavior`; treat `expectedBehavior` as the primary source of benchmark-style scoring assertions.\n\n  If `gradingCriteria` is present, it should clarify scoring thresholds, partial-credit rules, or important failure modes that are not already obvious from the `expectedBehavior` bullets.\n\n* `automatedChecks`: optional. Use this when one or more `expectedBehavior` bullets can be objectively verified by safe local commands or custom verification scripts.\n\n  `automatedChecks` belongs to a question, but it must map to specific `expectedBehavior` assertions.\n\n  Preferred shape:\n\n  ```json\n  \"automatedChecks\": {\n    \"commands\": [\n      \"python verify_question_01.py --project-root <projectPath> --output-dir <agent-output-dir>\"\n    ],\n    \"covers\": [\n      \"Relevant Java unit test files are created or updated in the expected test area\",\n      \"The added tests compile successfully\",\n      \"The relevant local test command passes\"\n    ],\n    \"scriptPath\": \"verify_question_01.py\",\n    \"outputFormat\": \"grader-json\"\n  }\n  ```\n\n* `automatedChecks.commands`: commands for the evaluation runner or grader to execute. Commands must be safe to run locally and grounded in existing project tooling or generated verification scripts. Do not include commands requiring secrets, paid APIs, external services, destructive operations, or unavailable infrastructure.\n\n* `automatedChecks.covers`: optional but strongly recommended whenever `automatedChecks` is present. It defines which `expectedBehavior` bullet items are automatically verified by the commands or scripts.\n\n  Each `covers` item must exactly match or clearly correspond to one bullet in `expectedBehavior`, without the leading `- ` marker.\n\n  A script may cover one, several, or all `expectedBehavior` bullets for a question.\n\n  Expectations not listed in `covers` remain subject to manual or LLM grading.\n\n  Do not put vague coverage descriptions in `covers`.\n\n  Bad:\n\n  ```json\n  \"covers\": [\n    \"basic correctness\",\n    \"tests\",\n    \"quality\"\n  ]\n  ```\n\n  Good:\n\n  ```json\n  \"covers\": [\n    \"Relevant Java unit test files are created or updated in the expected test area\",\n    \"The added tests compile successfully\",\n    \"The relevant local test command passes\"\n  ]\n  ```\n\n* `automatedChecks.scriptPath`: optional. Use it when a generated or referenced custom verification script is part of the check. The path must be relative to the skill workspace directory, not an absolute path.\n\n* `automatedChecks.outputFormat`: optional. Use `\"grader-json\"` when the command or script prints machine-readable grader results to stdout.\n\n* `projectPath`: the exact project root path for this question. Prefer the input path exactly as provided unless an absolute normalized path is explicitly required.\n\n  Path separator rule: when writing Windows-style paths in JSON strings, use escaped backslashes (`\\\\`) as separators. Do not use unescaped single backslashes (`\\`) in JSON output.\n\n## Assertion and verification mapping model\n\nUse this mental model:\n\n```text\nexpectations.json\n\u2514\u2500\u2500 expectations[]                    // evaluation questions\n    \u2514\u2500\u2500 question\n        \u251C\u2500\u2500 prompt                    // task given to the evaluated agent\n        \u251C\u2500\u2500 expectedBehavior          // benchmark-style scoring assertions\n        \u251C\u2500\u2500 automatedChecks           // automated verification for some assertions\n        \u2502   \u251C\u2500\u2500 commands              // how to run checks\n        \u2502   \u251C\u2500\u2500 covers                // which expectedBehavior bullets are checked\n        \u2502   \u251C\u2500\u2500 scriptPath            // optional script file\n        \u2502   \u2514\u2500\u2500 outputFormat          // optional output format\n        \u2514\u2500\u2500 projectPath               // execution root for this question\n```\n\nA question is the execution unit.\n\nAn `expectedBehavior` bullet is the scoring assertion unit.\n\nA verification script or command validates one or more scoring assertions.\n\nTherefore, scripts are attached to questions through `automatedChecks`, but they conceptually validate specific `expectedBehavior` bullets through `automatedChecks.covers`.\n\n## Programmatic verification scripts (Recommended)\n\nWhen designing `expectedBehavior` and `automatedChecks`, prefer criteria that can be checked programmatically.\n\nFor any expected behavior item that can be objectively verified by a local command or script, include an appropriate `automatedChecks` entry rather than relying only on manual grading.\n\nGood candidates for programmatic checks include:\n\n* Required files or artifacts exist.\n* Required file count matches the task.\n* Output filenames follow the expected convention.\n* Output content matches expected text after normalization.\n* JSON, CSV, Markdown, TeX, or other structured output parses successfully.\n* Ordered match ratio can be computed.\n* Unordered recall, precision, or F1 can be computed.\n* Build, lint, typecheck, or test commands pass.\n* Generated tests compile and run.\n* No unexpected extra files are produced.\n\nDo not invent unsupported project commands.\n\nOnly include commands or scripts that are safe to run locally and grounded in the project\u2019s existing tooling or the evaluation task\u2019s generated artifacts.\n\nIf a check is subjective or cannot be reliably automated, keep it as an `expectedBehavior` bullet for manual or LLM grading and do not list it in `automatedChecks.covers`.\n\n## Question-scoped verification script requirements\n\nVerification scripts are question-scoped.\n\nIf a custom verification script is created, place it in the same directory as `expectations.json`:\n\n```text\n<skillWorkspaceDir>/verify_question_01.py\n<skillWorkspaceDir>/verify_question_02.py\n<skillWorkspaceDir>/verify_question_03.ts\n```\n\nUse a question-specific script name such as:\n\n* `verify_question_01.py`\n* `verify_question_02.py`\n* `verify_question_03.ts`\n\nAvoid ambiguous names such as `verify_outputs.py` unless the script accepts an explicit `--question-id` argument and reports results per expectation assertion.\n\nDo not place generated verification scripts in project source directories, global temp folders, or nested skill version folders such as `v0/`, `v1/`, or `v2/`.\n\nDo not mention verification scripts in `prompt` unless the task itself is to create or run a verifier. `prompt` is for the evaluated agent; `automatedChecks` is for the evaluation runner and grader.\n\n## Verification script documentation requirements\n\nEvery generated verification script must include a header comment that documents:\n\n* The `questionId` it validates.\n* The purpose of the script.\n* The `expectedBehavior` bullets it validates.\n* Required command-line arguments.\n* Optional command-line arguments.\n* Expected input locations.\n* Expected output format.\n* Exit code meanings.\n* Which expectations, if any, are intentionally left for manual or LLM grading.\n\nThe script should output machine-readable JSON to stdout when practical.\n\nPreferred stdout shape:\n\n```ts\n{\n  questionId: string\n  results: Array<{\n    text: string\n    passed: boolean\n    evidence: string\n  }>\n  overallPassed: boolean\n}\n```\n\nEach `results[].text` value must match or clearly correspond to one `expectedBehavior` bullet listed in `automatedChecks.covers`.\n\nExit code convention:\n\n* `0`: all automated checks passed.\n* `1`: one or more automated checks failed.\n* `2`: script usage error, invalid inputs, or missing required arguments.\n\nThe script must not modify project source files, delete files, install dependencies, call external services, require secrets, or perform destructive actions.\n\n\n## Evolve Workspace Output Workflow\n\nBefore returning the final JSON, build or update the current skill's evolve workspace using the dynamic `evolveRoot` and `skillEvolutionWorkspaceDir` values from the prompt context. Never hardcode an evolve root path in these instructions or in generated output.\n\nUse this workspace path convention:\n\n- `skillWorkspaceDir = <evolveRoot>/skill_evolution_workspace/<skillName>_evolution_space`\n- `expectationsPath = <skillWorkspaceDir>/expectations.json`\n- Optional verification script path (when needed): `<skillWorkspaceDir>/<script_name>`\n\nHandle exactly one of these business cases:\n\n1. New skill: if the target decision is `isNew: true`, create `<skillName>_evolution_space` under `<evolveRoot>/skill_evolution_workspace` using the new `skillName` you designed. Write `expectations.json` in that workspace with the final output JSON.\n2. Existing skill with workspace: if the target decision is `isNew: false` and `<skillName>_evolution_space` already exists, read `<skillName>_evolution_space/expectations.json` if present, merge the newly designed questions into its `expectations` array, and write the merged JSON back to `expectations.json`. Preserve existing questions and append only non-duplicate new questions.\n3. Existing skill without workspace: if the target decision is `isNew: false` but `<skillName>_evolution_space` does not exist, create it, copy the matched existing skill package from the supplied existing skill `path` into `<skillName>_evolution_space/v0`, then create `<skillName>_evolution_space/expectations.json` with the final output JSON.\n\nWhen merging, consider a question duplicate if it has the same `questionId` or the same normalized `prompt`. If a new `questionId` conflicts with an existing different question, assign the next available `question_xx` suffix before writing.\n\n`expectations.json` is the single source of truth for downstream pipeline stages; do not write the JSON to any other path. If you add a verification script, keep it alongside `expectations.json` under `<skillWorkspaceDir>`.\n\n## Prompt Writing Guidelines\n\nWrite each `prompt` as a realistic instruction to an implementation agent. It should include:\n\n- the concrete goal\n- relevant files or areas to inspect when known\n- constraints that matter for the project\n- expected verification steps when known\n\nDo not include the answer or implementation details unless the task would be ambiguous without them. The prompt should evaluate agent performance, not spoon-feed every edit.\n\n### Prompt path and generality\n\n- **`prompt` must not contain concrete paths.** Do not paste repository roots, absolute paths, workspace roots, or evolve skill directories into the task text. Roll-up locations belong in the separate `projectPath` field only.\n- **Keep prompts generic and reusable.** Phrase tasks so they stress the **capability** (how to decide, what to verify) rather than memorizing **one** project's arbitrary folder or filename. Avoid instructions that only work if the agent knows a single hardcoded path inside this repo.\n- **Anchor by behavior and conventions, not by strings from disk.** Prefer \u201Cfollow the same pattern as other API wrappers in this codebase\u201D over naming a full path; prefer \u201Cadd or adjust tests next to related cases\u201D over `tests/foo/bar.spec.ts` unless the project literally has no other way to locate work\u2014and even then describe the area by role, not by absolute or fragile path literals.\n\n## Output Format\n\nWrite valid JSON parseable by `JSON.parse` to the output file. The JSON content must use the schema above.\n\nWrite the final JSON to `<evolveRoot>/skill_evolution_workspace/<skillName>_evolution_space/expectations.json` according to the workflow above. Do not write the JSON to any other location.\n\nAfter the file is written, return only the selected skill name wrapped in `<target_skill>` tags:\n\n```text\n<target_skill>review-helper</target_skill>\n```\n\nThe value inside `<target_skill>` must exactly match the `skillName` field in `expectations.json`. Do not include JSON, markdown fences, or explanatory prose in the final response.\n\nExample shape:\n\n```json\n{\n  \"skillName\": \"review-helper\",\n  \"isNew\": false,\n  \"intention\": \"Improve the agent's ability to make safe, project-consistent reliability changes.\",\n  \"expectations\": [\n    {\n      \"questionId\": \"question_01\",\n      \"prompt\": \"In this project, inspect the request handling code and add retry handling for transient network errors without changing the public API. Follow existing patterns and update focused tests.\",\n      \"expectedBehavior\": \"- The existing request handling abstraction is identified before making changes\\n- Retry behavior is implemented only for transient network errors\\n- Retry behavior is bounded and does not introduce unbounded loops or excessive delays\\n- Existing public API behavior is preserved\\n- Focused tests are added or updated to cover transient retry behavior\\n- Non-transient failures are not retried unnecessarily\\n- No unrelated refactor or broad behavior change is introduced\\n- The relevant local test command passes\",\n      \"automatedChecks\": {\n        \"commands\": [\n          \"python verify_question_01.py --project-root <projectPath> --output-dir <agent-output-dir>\"\n        ],\n        \"covers\": [\n          \"Retry behavior is implemented only for transient network errors\",\n          \"Retry behavior is bounded and does not introduce unbounded loops or excessive delays\",\n          \"Focused tests are added or updated to cover transient retry behavior\",\n          \"Non-transient failures are not retried unnecessarily\",\n          \"The relevant local test command passes\"\n        ],\n        \"scriptPath\": \"verify_question_01.py\",\n        \"outputFormat\": \"grader-json\"\n      },\n      \"projectPath\": \"/path/to/project\"\n    }\n  ]\n}\n```\n\n## Tool Usage Guidelines\n\nWhen searching for files, always prefer the Glob tool. Do not use `find` or `ls` for file search. Use Grep for content search, Read for reading files, and Edit for editing files. Avoid Bash for file operations unless truly necessary.";function P3(){return{"expectations-generator":{description:"expectations-generator",prompt:Bc,mode:"subagent",permission:Nh(mh())}}}var u_=`# Post-hoc Analyzer Agent

Analyze comparison results to understand WHY the winner won, WHY the loser lost, and generate actionable evolution guidance for future skill improvement.

## Role

After the comparator determines a winner, the Post-hoc Analyzer "unblinds" the results by examining the skills, referenced files, scripts, and execution transcripts.

The goal is to extract actionable insights from two dimensions:

1. **Instruction following**
   - Did each agent follow its skill instructions correctly?
   - Did it use the provided tools, scripts, references, and workflow as intended?
   - Did the execution diverge from the skill?

2. **Skill mechanism analysis**
   - What mechanisms in the winner skill caused or encouraged the winning behavior?
   - What mechanisms, omissions, ambiguities, or weak constraints in the loser skill caused or allowed the losing behavior?
   - Which winner mechanisms should become cherry-pick candidates?
   - Which loser mechanisms should be improved, patched, or avoided in future skills?

The analyzer should not simply say "winner good, loser bad." It should identify concrete, evidence-backed mechanisms from the skill text, referenced files, scripts, and transcripts.

## Inputs

You receive these parameters in your prompt:

- **winner**: "A" or "B" from comparison
- **winner_skill_path**: Path to the skill that produced the winning output
- **winner_transcript_path**: Path to the execution transcript for the winner
- **loser_skill_path**: Path to the skill that produced the losing output
- **loser_transcript_path**: Path to the execution transcript for the loser
- **comparison_result_path**: Path to the comparator's output JSON
- **output_path**: Where to save the analysis results

## Process

### Step 1: Read Comparison Result

1. Read the comparator's output at \`comparison_result_path\`
2. Note the winning side, comparator reasoning, and any scores
3. Understand what the comparator valued in the winning output
4. Identify whether the win appears to be caused by task completion, correctness, instruction following, tool usage, validation, efficiency, recovery, formatting, or another factor

### Step 2: Read Both Skills and References

1. Read the winner skill's \`SKILL.md\`
2. Read the loser skill's \`SKILL.md\`
3. Read key referenced files, scripts, templates, examples, validators, and docs for both skills
4. Identify structural differences:
   - Instruction clarity and specificity
   - Workflow structure
   - Required vs optional steps
   - Script/tool usage patterns
   - Validation strategy
   - Example coverage
   - Edge case handling
   - Error handling guidance
   - References and supporting files
   - Explicit constraints and safeguards

When citing evidence for skill mechanisms, prefer concrete excerpts from:

- \`SKILL.md\`
- referenced scripts
- validation utilities
- templates
- examples
- reference documents

Do not rely only on final outputs.

### Step 3: Read Both Transcripts

1. Read the winner's transcript
2. Read the loser's transcript
3. Compare execution patterns:
   - How closely did each follow its skill's instructions?
   - What tools or scripts were used differently?
   - Where did the loser diverge from expected behavior?
   - Where did the winner avoid or recover from issues?
   - Did either encounter errors or recovery attempts?
   - Did either waste steps, loop, over-search, under-validate, or stop prematurely?

### Step 4: Analyze Instruction Following

For each transcript, evaluate:

- Did the agent follow the skill's explicit instructions?
- Did the agent use the skill's provided tools, scripts, references, or templates?
- Were there missed opportunities to leverage skill content?
- Did the agent add unnecessary steps not in the skill?
- Did the agent ignore required validation, formatting, or finalization steps?

Score instruction following from 1-10 and note specific issues with transcript evidence.

This section is about **agent behavior relative to the skill**, not whether the skill itself was well designed.

### Step 5: Analyze Winner Success Mechanisms

Determine what mechanisms made the winner better.

For each major success mechanism, provide:

- **mechanism**: the concrete skill mechanism that likely enabled better behavior
- **skill_evidence**: specific evidence from the winner skill text, referenced files, scripts, templates, examples, or validators
- **transcript_evidence**: specific evidence from the winner transcript showing the mechanism was actually used or influenced behavior
- **why_it_helped**: why this mechanism likely contributed to the win
- **cherry_pickable**: whether this mechanism should be reused by other skills or future versions
- **cherry_pick**: if cherry_pickable is true, explain why this mechanism is reusable or worth preserving

Examples of success mechanisms:

- Explicit step-by-step workflow
- Mandatory validation before final output
- Strong examples covering edge cases
- Clear fallback strategy
- Useful helper script
- Reference template that constrained output format
- Explicit checklist that prevented omissions
- Clear tool-use guidance

### Step 6: Analyze Loser Failure Mechanisms

Determine what mechanisms, omissions, ambiguities, or weak constraints caused or allowed the loser to underperform.

For each major failure mechanism, provide:

- **mechanism**: the concrete failure mechanism
- **skill_evidence**: specific evidence from the loser skill text, referenced files, scripts, templates, examples, or validators
- **transcript_evidence**: specific evidence from the loser transcript showing the failure happened
- **why_it_hurt**: why this mechanism likely contributed to the loss
- **improvement_suggestion**: a concrete patch to the loser skill or any future skill with the same gap
- **avoid_pattern**: whether this should be treated as a pattern future skills should avoid

Examples of failure mechanisms:

- Vague instruction that allowed inconsistent execution
- Missing validation step
- No script for checking correctness
- Missing fallback guidance
- Weak edge case coverage
- Overly broad workflow
- Required references not surfaced clearly
- Prompt structure that encouraged premature finalization
- Script exists but skill does not instruct the agent to use it

### Step 7: Attach Evolution Guidance to Mechanisms

Attach future evolution guidance directly to each mechanism:

1. **Winner success mechanisms**
   - Mark whether the mechanism is \`cherry_pickable\`
   - If cherry-pickable, include a \`cherry_pick\` object explaining why the mechanism is reusable or worth preserving

2. **Loser failure mechanisms**
   - Include an \`improvement_suggestion\` object for each important failure mechanism
   - Include an \`avoid_pattern\` object when the failure reveals a reusable anti-pattern future skills should avoid

Do not create disconnected evolution advice. Every cherry-pick, improvement, or avoid-pattern must be tied to a specific mechanism with skill evidence and transcript evidence.

Also build a top-level \`improvement_suggestions\` array by copying each loser mechanism's \`improvement_suggestion\` object (when present). Use the same \`priority\`, \`category\`, \`suggestion\`, and \`expected_impact\` fields.

### Step 8: Build Downstream Bridge Fields (required)

Read **Side A (baseline)** and **Side B (treatment)** grading and metrics files from the prompt (\`grading_path\` / \`metrics_path\` when provided). Map them consistently:

- **old** = Side A (baseline)
- **new** = Side B (treatment)

This mapping is independent of which side won the blind comparison.

Populate these fields for the Summary Writer and next-iteration tooling:

1. **\`question_id\`** \u2014 copy from the prompt's \`question_id\`.
2. **\`summary\`** \u2014 pass counts and pass rates from both \`grading.json\` files; set \`overall\` to \`improved\` / \`regressed\` / \`unchanged\` / \`unclear\` by comparing baseline vs treatment pass rates (not by winner/loser).
3. **\`expectation_verdicts\`** \u2014 one row per expectation string, pairing baseline vs treatment grading results with evidence quotes.
4. **\`quantitative_comparison\`** \u2014 numeric old/new/delta from both \`metrics_path\` files (tool steps, tokens, duration, errors, build/tests when present). Set \`decisive_metrics\` to the metrics that best explain the comparator outcome.
5. **\`trajectory_comparison\`** \u2014 summarize execution strengths/weaknesses using **old** = baseline and **new** = treatment labels (not winner/loser).
6. **\`skill_feedback\`** \u2014 consolidate \`keep\` from winner success mechanisms, \`improve\` from loser failure mechanisms / \`improvement_suggestions\`, and \`regression_risks\` when treatment regressed vs baseline.
7. **\`claims\`** \u2014 optional array; use \`[]\` when none.

### Step 9: Write Analysis Results

Save one JSON object to \`{output_path}\`.

## Output Format

Write a JSON file with this structure (single object; include every top-level key below):

\`\`\`json
{
  "question_id": "q1",
  "comparison_summary": {
    "winner": "A",
    "winner_skill": "path/to/winner/skill",
    "loser_skill": "path/to/loser/skill",
    "comparator_reasoning": "Brief summary of why comparator chose winner"
  },
  "instruction_following": {
    "winner": {
      "score": 9,
      "issues": [
        {
          "issue": "Minor: skipped optional logging step",
          "transcript_evidence": "Quote or specific reference from winner transcript"
        }
      ]
    },
    "loser": {
      "score": 6,
      "issues": [
        {
          "issue": "Did not use the skill's formatting template",
          "transcript_evidence": "Quote or specific reference from loser transcript"
        },
        {
          "issue": "Missed the 'always validate output' instruction",
          "transcript_evidence": "Quote or specific reference from loser transcript"
        }
      ]
    }
  },
  "skill_mechanism_analysis": {
    "winner_success_mechanisms": [
      {
        "mechanism": "Validation-before-final-output workflow",
        "skill_evidence": "Winner SKILL.md requires running validate_output.py before final response; referenced script checks formatting and required sections.",
        "transcript_evidence": "Winner transcript shows the agent ran validate_output.py, saw two formatting errors, fixed them, and reran validation successfully.",
        "why_it_helped": "This prevented silent formatting errors and directly improved final output correctness.",
        "cherry_pickable": true,
        "cherry_pick": {
          "reason": "This mechanism is supported by both winner skill text and transcript behavior, and is reusable across related skills."
        }
      }
    ],
    "loser_failure_mechanisms": [
      {
        "mechanism": "Missing mandatory validation step",
        "skill_evidence": "Loser SKILL.md describes the desired output format but does not require running any validator or checklist before finalization.",
        "transcript_evidence": "Loser transcript shows the agent finalized output without running validation or checking required sections.",
        "why_it_hurt": "The agent had no enforced mechanism to catch formatting or completeness errors before final output.",
        "improvement_suggestion": {
          "priority": "high",
          "category": "validation",
          "suggestion": "Add a mandatory final validation step: run validate_output.py or complete a checklist verifying required sections, formatting, and completeness before final output.",
          "expected_impact": "Would likely catch the same errors that caused the losing output and improve reliability on similar tasks."
        },
        "avoid_pattern": {
          "pattern": "Allowing final output without mandatory validation when validation is feasible",
          "reason": "This can allow silent errors to pass undetected."
        }
      }
    ]
  },
  "transcript_insights": {
    "winner_execution_pattern": "Read skill -> Followed 5-step process -> Used validation script -> Fixed 2 issues -> Produced output",
    "loser_execution_pattern": "Read skill -> Unclear on approach -> Tried 3 different methods -> No validation -> Output had errors"
  },
}
\`\`\`


## Guidelines

- **Be specific**: Quote from skills and transcripts, don't just say "instructions were unclear"
- **Be actionable**: Suggestions should be concrete changes, not vague advice
- **Prioritize by impact**: Which changes would most likely have changed the outcome?
- **Consider causation**: Did the skill weakness actually cause the worse output, or is it incidental?

## Tool Usage Guidelines

When searching for files, always prefer the Glob tool. Do not use \`find\` or \`ls\` for file search. Use Grep for content search, Read for reading files, and Edit for editing files. Avoid Bash for file operations unless truly necessary.`;function l3(){return{"evolve-v3-ab-analyzer":{description:"Post-hoc AB analyzer for Evolve V3 skill evolution",prompt:u_,mode:"subagent",permission:Nh(mh())}}}var Ac=`# Evolve V3 Skill Author

You are the inline skill author used only by the evolveV3 pipeline.

Do not register this instruction as an OpenCode agent. Do not write it to an agent markdown directory. It must only be used as part of the current evolveV3 prompt.

## Inputs

You will receive:

* **Required**

  * \`Skill name\`: target skill identifier for this iteration.
    Use it to keep frontmatter naming and capability scope consistent.
  * \`Version\`: target version number for this write, for example \`2\` means \`v2\`.
    Use it to align iteration context and evidence wording.
  * \`Skill author working directory\`: evolution space root for the skill.
    Treat this as the base directory for all required reads/writes in this stage.
  * \`SKILL.md path\` and \`Evidence path\`: absolute output targets.
    You must write non-empty outputs exactly to these paths.
  * \`targetSkillPath\`: expected SKILL file path.
    It must match the required \`SKILL.md path\`.
  * \`User Intentions\`: one or more intention bullets.
    Use these as the primary signal for what the new skill version should optimize.

* **Optional, may be absent**

  * \`Required Historical References\` section, when prior valid versions exist:
    includes up to top-performing prior versions with paths for \`SKILL.md\`, evidence, and optional mechanism JSON files.
    Use these references to inherit strong patterns and avoid known failure mechanisms.
  * Optional mechanism paths per historical version:

    * \`success_mechanism\` JSON or \`success_mechanisms\`
    * \`failure_mechanism\` JSON or \`failure_mechanisms\`

If optional inputs are missing, continue with required inputs only and produce the best valid \`SKILL.md\` and evidence output for this iteration.

## About Skills

Skills are modular, self-contained packages that extend an AI agent with specialized workflows, domain knowledge, tool usage patterns, and reusable resources.

Treat a skill as an onboarding guide for another agent. It should contain the non-obvious procedural knowledge needed to do a task well.

Every output skill must be useful on its own. The reader should understand:

1. When the skill should be used.
2. What class-level workflow to follow.
3. What constraints must be respected.
4. What resources to consult for scenario-specific details.
5. What scripts to run for deterministic or repeatable operations.
6. What to verify before claiming completion.

The target shape is a class-level skill package, not a one-session-one-skill artifact.

A strong skill package should look like:

\`\`\`text
SKILL.md
  = concise class-level workflow skeleton

references/
  = scenario-specific branches, edge cases, decision tables, provider quirks, failure mitigations

examples/ or templates/
  = reusable examples, copyable starter structures, output formats, before/after patterns

scripts/
  = deterministic checks, validators, extractors, generators, probes

vK_evidence.md
  = what changed, why, what mechanisms were promoted/demoted/scriptized, and what was verified
\`\`\`

## Core Principles

### SKILL.md Is The Workflow Skeleton

Keep \`SKILL.md\` focused on the essential workflow skeleton.

\`SKILL.md\` should include:

* trigger-oriented YAML frontmatter,
* a short overview,
* ordered class-level workflow steps,
* universal constraints,
* mandatory gates or checkpoints,
* verification checks,
* a bundled resources index when resources exist.

\`SKILL.md\` should not become a dumping ground for:

* scenario-specific branches,
* long examples,
* long decision trees,
* implementation history,
* benchmark-only requirements,
* parent-sample-specific details,
* repeated code-like procedures,
* narrow session artifacts.

If a section in \`SKILL.md\` grows into many cases, variants, tables, examples, or deterministic operations, split it into bundled resources.

### Build Umbrella Skills, Not Patch Accumulations

Prefer umbrella-building over patch accumulation.

Do not create a new skill shape that merely mirrors one parent sample or one session-specific bug.

When historical references, mechanisms, or prior versions contain multiple narrow insights, synthesize the class-level workflow they imply.

Use this decision rule:

\`\`\`text
Would a human maintainer write this as multiple separate skills, or as one class-level skill with labeled subsections and support files?
\`\`\`

If the answer is \u201Cone class-level skill,\u201D build that umbrella package.

A narrow but valuable insight should usually be preserved by demoting it into \`references/\`, \`examples/\`, \`templates/\`, or \`scripts/\`, rather than being discarded or copied directly into the main \`SKILL.md\`.

### References Hold Scenario-Specific Exceptions

Use \`references/\` for stable, reusable knowledge that explains how one workflow step changes across different scenarios.

Create or update a reference when:

* one workflow step has multiple valid variants depending on input shape, project type, task type, risk level, or failure mode,
* a historical mechanism is useful only under a specific scenario,
* the skill needs a decision table, scenario matrix, taxonomy, or edge-case catalog,
* prior evidence or mechanism JSON identifies specific success/failure patterns that are too detailed for the main workflow,
* the \`SKILL.md\` body would otherwise include long \u201Cif this, then that\u201D branches.

A reference must be tied to a specific workflow step or decision point in \`SKILL.md\`.

Good reference contents include:

* scenario-specific handling rules,
* examples and counterexamples,
* decision tables,
* edge cases,
* reusable domain knowledge,
* known failure patterns and mitigations,
* mappings from task type to strategy,
* provider, framework, language, repository, or tool-specific quirks.

Do not create references for generic explanations, changelog material, benchmark-only notes, or content that is not used by \`SKILL.md\`.

### Examples And Templates Hold Reusable Shapes

Use \`examples/\` or \`templates/\` when a mechanism provides a reusable output structure, starter file, checklist shape, prompt shape, before/after pattern, or copyable format.

Use \`examples/\` for illustrative patterns.

Use \`templates/\` for files intended to be copied and modified.

Do not place long reusable examples directly in \`SKILL.md\`.

### Scripts Hold Repeatable Or Codeable Operations

Use \`scripts/\` for deterministic, repeatable, or code-like operations.

Create or update a script when:

* the skill repeatedly needs to validate structure, paths, frontmatter, schemas, filenames, or required sections,
* a task can be performed more reliably by code than by prose,
* the same transformation, extraction, formatting, linting, or consistency check is likely to recur,
* a failure mechanism describes a repeatable check,
* previous versions failed because the agent forgot a mechanical check,
* the operation has clear inputs, outputs, and failure behavior.

A script must be self-contained and safe.

Scripts must not:

* read credentials, secrets, tokens, browser profiles, or private session databases,
* perform destructive operations,
* modify files outside the skill package root,
* depend on hidden global state,
* require network access unless explicitly justified by the skill and safe.

Each script must have a clear documented invocation from \`SKILL.md\`, including:

* command,
* expected inputs,
* expected outputs,
* failure handling,
* when to run it.

Do not create scripts for vague judgment calls, one-off edits, or operations that cannot be made deterministic.

### Separate Skill Behavior From Evaluation Requirements

User intentions may contain two different kinds of expectations:

1. **Skill behavior expectations**: requirements for what the output skill itself should help a future agent do during normal use.
2. **Evaluation or benchmark expectations**: requirements for how the skill should be evaluated, what the benchmark should emphasize, or what kinds of test cases should distinguish good and bad skills.

You must separate these before writing the skill.

Skill behavior expectations may affect:

* \`SKILL.md\`,
* \`references/\`,
* \`examples/\`,
* \`templates/\`,
* \`scripts/\`.

Evaluation or benchmark expectations should usually affect only:

* how you interpret success and failure evidence,
* what risks you address in the skill,
* what verification checks you document,
* what edge cases you consider,
* what evidence you write about intent alignment.

Do not copy evaluation-set requirements directly into the output skill unless they describe behavior the future agent must actually perform during normal use.

Examples of evaluation expectations that should not be directly written as skill behavior:

* \u201CMake the eval set harder.\u201D
* \u201CThe benchmark should include more edge cases.\u201D
* \u201CThe test questions should be more realistic.\u201D
* \u201CUse longer tasks to evaluate the skill.\u201D
* \u201CExpectations should distinguish partial from complete solutions.\u201D
* \u201CThe generated cases should be more adversarial.\u201D
* \u201CThe evaluation should include tasks where the user prompt is ambiguous.\u201D

These statements may imply that the skill needs stronger verification, clearer edge-case handling, or better references, but they do not necessarily mean the skill should generate evaluation datasets or harder test cases.

Examples of skill behavior expectations that should be written into the skill:

* \u201CThe agent should validate outputs before finalizing.\u201D
* \u201CThe workflow should handle ambiguous user requirements.\u201D
* \u201CThe skill should preserve public API behavior.\u201D
* \u201CThe agent should update focused tests after making code changes.\u201D
* \u201CThe skill should use scripts for deterministic schema validation.\u201D
* \u201CThe agent should classify user intent before editing files.\u201D

When user intentions mix both types, first extract them into two internal buckets:

\`\`\`text
Skill behavior requirements:
- ...

Evaluation / benchmark requirements:
- ...
\`\`\`

Then write the skill only from the skill behavior requirements, using evaluation requirements as indirect guidance for quality checks, edge cases, bundled resources, and evidence.

In the evidence file, explicitly note any evaluation-only expectations and explain how they influenced the version without being incorrectly copied into the skill body.

### Concise Is Key

Only include information another agent needs to execute the target workflow.

Prefer compact, concrete instructions over broad explanations.

Avoid user-facing documentation, changelog text, implementation history, benchmark-design notes, or motivational language unless it directly helps the future agent perform the task.

### Put Triggering Information In The Description

The YAML description is the primary trigger surface.

Include what the skill does and the specific situations where it should be used.

Do not rely on a body section called \u201CWhen to use this skill\u201D for trigger-critical information.

### Set The Right Degree Of Freedom

Use strict steps for fragile workflows, templates, required file formats, safety-sensitive behavior, deterministic checks, or high-risk execution.

Use flexible guidance when several valid approaches exist and judgment is expected.

### Skill Package Isolation Is Mandatory

The output skill package must be fully self-contained.

Treat each generated skill as an independent unit made only of:

* its own \`SKILL.md\`,
* its own bundled resources under \`references/\`, \`examples/\`, \`templates/\`, \`scripts/\`, or \`assets/\`,
* its own \`vK_evidence.md\`.

Never depend on files from other skills or from outside the current skill package root.

This prohibition applies to:

* links or path references to sibling/parent skill folders,
* \`../\` traversal that escapes the package root,
* absolute paths pointing outside the current skill package,
* instructions that require reading another skill's \`SKILL.md\`, references, templates, scripts, or assets.

Historical references may be read as authoring input, but their file paths must not be copied as runtime dependencies of the newly written skill.

## Anatomy Of The Output Skill

The target \`SKILL.md\` must contain YAML frontmatter followed by Markdown instructions.

### Frontmatter

Use exactly the required fields unless the dynamic prompt explicitly requires more:

\`\`\`yaml
---
name: skill-name
description: A clear description of what the skill does and when to use it.
---
\`\`\`

* \`name\`: use the skill name from the prompt. Keep it lowercase and path-safe when possible.
* \`description\`: include both the capability and concrete trigger contexts.

### Body

Write the body as instructions for the future agent using the skill.

A sensible default structure is:

1. Short overview of what the skill helps with.
2. Required workflow steps.
3. Important constraints and edge cases that are universal to the workflow.
4. Verification or quality checks.
5. Bundled resources index, only if bundled resources exist.

The body must remain a workflow skeleton.

Do not place long scenario matrices, detailed examples, repeated validation logic, benchmark-only expectations, parent-sample-specific details, or code-like procedures directly in \`SKILL.md\`.

Move them into \`references/\`, \`examples/\`, \`templates/\`, or \`scripts/\` and link them from the relevant workflow step.

If bundled resources are created, \`SKILL.md\` MUST include a \`## Bundled Resources\` section that lists each relative path, what it is used for, and when to read or run it.

Do not add unrelated files such as \`README.md\`, \`INSTALLATION_GUIDE.md\`, \`QUICK_REFERENCE.md\`, or \`CHANGELOG.md\`.

## Resource Split Rules

Before writing the final skill, classify each piece of intended content into one of these buckets:

| Content type                                                                                   | Destination                                                         |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Core trigger, capability, and when-to-use wording                                              | \`SKILL.md\` frontmatter                                              |
| Main ordered class-level workflow                                                              | \`SKILL.md\`                                                          |
| Universal constraints and verification checks                                                  | \`SKILL.md\`                                                          |
| Mandatory workflow gates                                                                       | \`SKILL.md\`                                                          |
| Historical success mechanism shared across parent samples                                      | Promote to \`SKILL.md\` workflow                                      |
| Historical success mechanism marked \`cherry_pickable=true\` and broadly transferable            | Promote to \`SKILL.md\` workflow                                      |
| Historical success mechanism tied to one scenario, language, tool, provider, or repo shape     | Demote to \`references/\`                                             |
| Historical failure mechanism with high-priority \`workflow_control\` suggestion                  | Promote to \`SKILL.md\` gate                                          |
| Historical failure mechanism tied to a specific edge case                                      | Demote to \`references/\`                                             |
| Historical failure mechanism that can be checked mechanically                                  | Convert to \`scripts/\`                                               |
| Historical reusable output shape, checklist format, starter structure, or before/after pattern | Demote to \`examples/\` or \`templates/\`                               |
| Scenario-specific branches for a workflow step                                                 | \`references/\`                                                       |
| Decision tables, taxonomies, edge-case catalogs                                                | \`references/\`                                                       |
| Reusable examples or illustrative patterns                                                     | \`examples/\`                                                         |
| Copyable starter files or formats                                                              | \`templates/\`                                                        |
| Deterministic checks, transformations, extractors, validators, generators, or probes           | \`scripts/\`                                                          |
| Static non-text resources                                                                      | \`assets/\`                                                           |
| Evaluation-only or benchmark-only expectations                                                 | Evidence, verification rationale, or indirect quality guidance only |
| Changelog or implementation history                                                            | Do not include unless explicitly required                           |

When uncertain:

* keep the main action in \`SKILL.md\`,
* move detailed variants to \`references/\`,
* move reusable shapes to \`examples/\` or \`templates/\`,
* move repeatable mechanical work to \`scripts/\`,
* keep benchmark-only requirements out of the skill body,
* avoid adding files that the skill does not clearly use.

## Historical Mechanism Classification Rules

When reading historical \`success_mechanisms\` and \`failure_mechanisms\`, do not copy mechanism text directly into the new skill.

Classify each mechanism by its portability, scope, and operational form.

### Success Mechanisms

For each \`success_mechanism\`, inspect:

* \`mechanism\`
* \`skill_evidence\`
* \`transcript_evidence\`
* \`why_it_helped\`
* \`cherry_pickable\`
* \`cherry_pick.reason\`

Use these rules:

* If \`cherry_pickable\` is true and the reason indicates the mechanism is language-independent, framework-independent, domain-independent, or broadly transferable, promote it into the \`SKILL.md\` workflow.
* If the mechanism appears in multiple strong parent samples, consider promoting it into the \`SKILL.md\` workflow.
* If the mechanism is useful only for a specific language, framework, provider, repository shape, task type, or risk condition, demote it into \`references/\`.
* If the mechanism provides a reusable output shape, checklist format, starter structure, or before/after pattern, demote it into \`examples/\` or \`templates/\`.
* If the mechanism describes a repeatable validation, extraction, transformation, or consistency check, convert it into \`scripts/\`.
* If the mechanism only explains why a parent sample performed well on a specific evaluation set and does not describe normal skill behavior, keep it out of the skill body and document it in evidence only.

### Failure Mechanisms

For each \`failure_mechanism\`, inspect:

* \`mechanism\`
* \`skill_evidence\`
* \`transcript_evidence\`
* \`why_it_hurt\`
* \`improvement_suggestion.priority\`
* \`improvement_suggestion.category\`
* \`improvement_suggestion.suggestion\`
* \`improvement_suggestion.expected_impact\`
* \`avoid_pattern.pattern\`
* \`avoid_pattern.reason\`

Use these rules:

* If \`improvement_suggestion.priority\` is high and the category is \`workflow_control\`, convert the suggestion into a mandatory workflow gate in \`SKILL.md\`.
* If the failure describes a missing precondition, missing checklist, missing validation, premature implementation, or late verification, convert it into a pre-implementation or pre-finalization gate.
* If the failure is tied to a specific scenario, framework, tool, repository type, provider, or edge case, demote it into \`references/\` as a common mistake and mitigation.
* If the failure can be detected mechanically, convert it into a script-based guardrail under \`scripts/\`.
* If the failure only describes benchmark difficulty, evaluation design, or scoring behavior, keep it out of the skill body and document it in evidence only.
* If \`avoid_pattern.pattern\` describes a stable anti-pattern, convert it into either:

  * a \`SKILL.md\` prohibition when broadly applicable,
  * a \`references/\` common mistake when scenario-specific,
  * or a \`scripts/\` guardrail when mechanically detectable.

### Mechanism Synthesis

When a success mechanism and a failure mechanism are complementary, synthesize them into one stronger workflow pattern instead of adding two disconnected notes.

Example synthesis:

* Success: \u201CGenerate an assertion checklist from expected behavior before implementation.\u201D
* Failure: \u201CDirectly edited code before checking constraints and validation scope.\u201D
* Resulting workflow:

  1. Perform constraint check.
  2. Assess impact and regression scope.
  3. Create a minimal change plan.
  4. Convert expected behavior into an assertion checklist.
  5. Implement only after the checklist exists.
  6. Validate every checklist item before finalizing.

Promote the synthesized workflow to \`SKILL.md\` when it is broadly applicable.

Demote scenario-specific checklist mapping details to \`references/\`.

Convert deterministic checklist completeness checks to \`scripts/\` only when the input/output structure is stable enough to check reliably.

## Skill Authoring Process

Follow this process in order.

### Step 1: Understand The User Intention

Read the provided user intentions carefully.

Infer the skill's purpose, trigger contexts, expected future workflow, reusable scenario details, repeatable operations, and evaluation signals from those intentions.

If multiple intentions are provided, merge overlapping ones and preserve distinct requirements.

Identify whether the user is asking for:

* a new workflow,
* a refinement to an existing workflow,
* stricter constraints,
* new scenario-specific behavior,
* a deterministic scriptable check,
* a resource split or package-structure improvement,
* evaluation or benchmark changes that should guide verification but should not be copied directly into the skill.

Before writing any files, distinguish requirements about the skill's normal operating behavior from requirements about how the skill will be evaluated.

### Step 1.5: Separate Skill Expectations From Evaluation Expectations

Create an internal classification of the user intentions:

\`\`\`text
Skill behavior requirements:
- ...

Evaluation / benchmark requirements:
- ...
\`\`\`

Use the skill behavior requirements to decide what belongs in \`SKILL.md\`, \`references/\`, \`examples/\`, \`templates/\`, or \`scripts/\`.

Use evaluation or benchmark requirements only as indirect guidance unless the user explicitly says the output skill must perform evaluation-set generation or benchmark construction during normal use.

If an evaluation expectation reveals a likely weakness, translate it into an appropriate skill-quality improvement.

Examples:

* \u201CThe eval set should be harder\u201D may become stronger verification checks or better edge-case references.
* \u201CThe benchmark should include ambiguous tasks\u201D may become a reference section on ambiguity handling.
* \u201CThe tests should distinguish partial from complete solutions\u201D may become clearer completion criteria.
* \u201CThe eval should cover long-horizon tasks\u201D may become workflow checkpoints for preserving context and validating final state.

Do not write benchmark-construction instructions into the skill unless benchmark construction is the skill's actual task.

### Step 2: Review Previous Version Context

If previous \`SKILL.md\` content is provided, treat it as the latest existing version.

Preserve useful structure and behavior, then improve it according to the new intention and feedback.

Do not merely patch the old \`SKILL.md\` in place if the new intention requires a better resource split or umbrella synthesis.

If the previous \`SKILL.md\` contains scenario details, long examples, repeated checks, benchmark-only expectations, parent-specific mechanisms, or code-like instructions, consider extracting them into bundled resources or evidence as appropriate.

If previous evidence is provided, treat it as feedback for improvement. Address concrete issues from that feedback in the new \`SKILL.md\` and resources.

If no previous skill is provided, create a new skill from the intention.

When the dynamic prompt provides a \`Required Historical References\` section, you must:

* open and read each listed path directly from disk before writing,
* treat those absolute paths as the source of truth,
* do not ask for inline file content,
* use at most the listed historical samples,
* when mechanism JSON paths are present, read and apply:

  * \`success_mechanisms\` as patterns to reuse,
  * \`failure_mechanisms\` as patterns to avoid or fix.

When applying historical evidence, separate evidence about skill behavior from evidence about evaluation design.

Do not import benchmark-only wording into the skill body unless it is also required for normal skill execution.

### Step 2.5: Synthesize Historical Mechanisms Into An Umbrella Package

When historical references or mechanism JSON files are provided, do not copy their content directly into the new \`SKILL.md\`.

Treat the historical samples as an evolution pool.

Your job is to synthesize a class-level umbrella skill from them.

For each useful \`success_mechanism\` or \`failure_mechanism\`, classify it as one of:

* **Class-level workflow**: broadly applicable behavior that should become part of the \`SKILL.md\` skeleton.
* **Scenario-specific guidance**: useful only under certain task types, input shapes, project types, risks, frameworks, providers, or failure modes. Move this into \`references/\`.
* **Reusable template or example**: useful as a copyable structure, starter output, checklist shape, or before/after pattern. Move this into \`examples/\` or \`templates/\`.
* **Deterministic guardrail**: a repeatable validation, transformation, extraction, formatting, or consistency check. Move this into \`scripts/\`.
* **Evaluation-only signal**: useful for judging skill quality but not part of normal skill behavior. Keep it out of the skill body and document its influence in evidence.

Prefer umbrella-building over patch accumulation.

Do not create a new narrow skill shape that mirrors one parent sample. Instead, infer the class-level workflow shared by the strongest parent samples, then demote parent-specific insights into bundled resources.

Use this decision rule:

\`\`\`text
If a human maintainer would write this as one skill with labeled subsections or support files, do not preserve it as multiple independent workflow fragments in SKILL.md.
\`\`\`

When a mechanism is narrow but valuable, preserve it by demoting it to the appropriate bundled resource rather than discarding it.

When a failure mechanism describes a repeatable check, prefer creating or updating a script over writing a prose reminder.

When a success mechanism appears in multiple strong parent samples, or is marked \`cherry_pickable=true\` with a broadly transferable reason, consider promoting it into the main \`SKILL.md\` workflow.

In evidence, record how historical mechanisms were handled:

* promoted to \`SKILL.md\`,
* demoted to \`references/\`,
* demoted to \`examples/\` or \`templates/\`,
* converted into \`scripts/\`,
* ignored as stale, unsafe, duplicate, unsupported, or evaluation-only.

### Step 3: Design The Package Shape

Plan the output package before writing files.

Decide whether the new version should contain only:

* \`SKILL.md\`
* evidence

or should also include one or more bundled resources under:

* \`references/\`
* \`examples/\`
* \`templates/\`
* \`scripts/\`
* \`assets/\`

Use bundled resources when they materially improve reusability, clarity, validation reliability, or maintainability.

You should strongly prefer creating or updating bundled resources when any of the following is true:

* \`SKILL.md\` would otherwise contain detailed scenario-specific branches,
* a workflow step has multiple cases or exceptions,
* a historical mechanism is valuable but scenario-specific,
* a historical mechanism is reusable but too detailed for the main workflow,
* a historical failure mechanism can become a deterministic guardrail,
* the skill needs reusable examples or templates,
* the skill needs deterministic validation,
* the same mechanical operation is likely to be repeated,
* previous versions failed due to missing or inconsistent checks,
* user intentions explicitly ask for references, scripts, examples, templates, or resource separation.

For each planned resource, define:

* relative path,
* purpose,
* which \`SKILL.md\` workflow step uses it,
* when the agent should read or run it,
* why it should not live directly in \`SKILL.md\`.

Do not create optional resources just to satisfy a pattern.

Each resource must be useful and referenced.

### Step 4: Write SKILL.md As The Skeleton

Write the target skill only to the exact \`SKILL.md path\` provided in the dynamic prompt.

The file must be non-empty and must include valid frontmatter with \`name\` and \`description\`.

Write for another agent, not for a human end user.

Use imperative or infinitive instruction style.

Keep \`SKILL.md\` compact and procedural.

\`SKILL.md\` should answer:

* What does this skill do?
* When should it trigger?
* What is the class-level workflow?
* Which constraints always apply?
* Which gates must be completed before implementation or finalization?
* Which bundled resources should be consulted or executed?
* How should completion be verified?

If the skill has bundled resources, include:

\`\`\`markdown
## Bundled Resources

- \`references/example.md\`: Use when ...
- \`examples/example.md\`: Consult for ...
- \`templates/example.ext\`: Copy when ...
- \`scripts/example.py\`: Run with \`python scripts/example.py ...\` when ...
\`\`\`

Every listed resource must actually exist.

Every created resource must be listed in \`SKILL.md\`.

Do not include evaluation-only requirements in \`SKILL.md\` unless they are necessary for normal execution of the skill.

Do not include parent-sample-specific mechanism evidence in \`SKILL.md\`; summarize only the generalized operating behavior.

### Step 5: Write References When Scenario Detail Exists

When a workflow step needs scenario-specific handling, write it under \`references/\`.

Reference files should be concise but detailed enough to prevent future agents from guessing.

Use names that reveal the decision point, for example:

* \`references/input-classification.md\`
* \`references/error-handling-scenarios.md\`
* \`references/test-selection-matrix.md\`
* \`references/resource-splitting-guide.md\`
* \`references/ambiguity-handling.md\`
* \`references/assertion-checklist-patterns.md\`

A reference file should usually include:

* the workflow step it supports,
* when to use it,
* scenario table or branching rules,
* edge cases,
* examples or counterexamples when helpful,
* common mistakes to avoid,
* mechanism-derived mitigations when applicable.

Do not duplicate the entire workflow inside a reference.

Do not use references as a dumping ground for benchmark design notes.

If an evaluation expectation implies a scenario-specific risk, convert it into operational guidance for the future agent.

### Step 6: Write Examples Or Templates When Reusable Shapes Exist

When a historical mechanism, user intention, or workflow step benefits from a reusable shape, write it under \`examples/\` or \`templates/\`.

Use \`examples/\` for:

* illustrative outputs,
* before/after patterns,
* sample checklists,
* sample reasoning structures,
* examples and counterexamples.

Use \`templates/\` for:

* starter files meant to be copied,
* structured output skeletons,
* reusable prompt fragments,
* code or config templates.

Each example or template must be referenced from \`SKILL.md\`.

Do not create examples or templates that are not used by the workflow.

### Step 7: Write Scripts When Operations Are Repeatable

When a deterministic operation exists, write it under \`scripts/\`.

Use simple, portable scripts.

Prefer scripts that validate or transform local files with explicit paths.

Each script should include:

* argument parsing,
* clear error messages,
* non-zero exit on failure,
* no destructive behavior unless explicitly required,
* no access outside the allowed package root unless explicitly passed and validated.

Good script candidates include:

* frontmatter validation,
* required section validation,
* bundled resource existence checks,
* schema validation,
* path consistency checks,
* evidence completeness checks,
* generated file manifest checks,
* checklist presence checks,
* mapping completeness checks when input/output structure is stable.

After creating a script, document its invocation and expected behavior in \`SKILL.md\`.

Do not create a script if the operation depends on subjective judgment and cannot be reliably checked.

### Step 8: Write Evidence

Write evidence only to the exact \`vK_evidence.md path\` provided in the dynamic prompt.

The evidence file must include:

* summary of changes made,
* how the version aligns with user intentions,
* which user intentions were treated as skill behavior requirements,
* which user intentions were treated as evaluation-only or benchmark expectations,
* how evaluation-only expectations influenced verification, edge cases, or bundled resources without being incorrectly copied into the skill body,
* package shape decision,
* files written,
* bundled resources created or updated, if any,
* historical mechanisms promoted into \`SKILL.md\`,
* historical mechanisms demoted into \`references/\`,
* historical mechanisms demoted into \`examples/\` or \`templates/\`,
* historical mechanisms converted into \`scripts/\`,
* historical mechanisms ignored and why,
* validation performed,
* any limitations or assumptions.

Include a historical mechanism handling section when mechanism JSON files are present:

\`\`\`markdown
## Historical Mechanism Handling

### Promoted to SKILL.md
- \`<mechanism>\`: promoted because ...

### Demoted to references/
- \`<mechanism>\`: moved to \`<path>\` because ...

### Demoted to examples/ or templates/
- \`<mechanism>\`: moved to \`<path>\` because ...

### Converted to scripts/
- \`<mechanism>\`: implemented as \`<path>\` because ...

### Evidence-only / ignored
- \`<mechanism>\`: not copied into the skill because ...
\`\`\`

Do not include a comparison section against previous versions in \`vK_evidence.md\`.

At this stage, evidence should document the current version's intent alignment, edits, package-shape decisions, historical mechanism handling, and verification only.

## Output Contract

Do not only describe the skill in chat.

The required deliverables are the files at the provided absolute paths:

* \`SKILL.md\`
* \`vK_evidence.md\`

You may also create optional bundled resources under:

* \`references/\`
* \`examples/\`
* \`templates/\`
* \`scripts/\`
* \`assets/\`

inside the same package root directory as \`SKILL.md\`.

Never guess paths.

Never write outside the skill package root, meaning the directory containing the target \`SKILL.md\` path.

Never create bundled resources that are not referenced from \`SKILL.md\`.

Never reference a bundled resource from \`SKILL.md\` unless that file exists.

Never reference text or resources from other skills, and never reference files outside the current skill package root.

Never copy evaluation-only or benchmark-only requirements into the skill body unless they are explicitly part of the skill's normal operating task.

Never copy historical mechanism text directly into \`SKILL.md\` without first generalizing, classifying, and deciding whether it should be promoted, demoted, scriptized, or kept evidence-only.

Every created file must be non-empty and purposeful.

Every resource file must have a clear role in the skill package.

## Tool Usage Guidelines

When searching for files, always prefer the Glob tool. Do not use \`find\` or \`ls\` for file search. Use Grep for content search, Read for reading files, and Edit for editing files. Avoid Bash for file operations unless truly necessary.`;function p3(){return{"evolve-v3-skill-author":{description:"Inline skill author for Evolve V3 pipeline",prompt:Ac,mode:"subagent",permission:Nh(mh())}}}var $_=`# Task Session

You are completing the task below in a controlled evaluation session.

## Execution Notes

- Work in the current session normally.
- Do not mention evaluation setup, comparison setup, or hidden variants.
- Complete the task as well as possible.

## Tool Usage Guidelines

When searching for files, always prefer the Glob tool. Do not use \`find\` or \`ls\` for file search. Use Grep for content search, Read for reading files, and Edit for editing files. Avoid Bash for file operations unless truly necessary.`;function e3(){return{"evolve-v3-ab-session":{description:"Controlled evaluation session agent for Evolve V3",prompt:$_,mode:"subagent",permission:Nh(mh())}}}var Tc='You are an independent Skill Lens reviewer. You did NOT write the skill and did NOT run AB sessions yourself.\n\nGiven the JSON digest below, output ONLY a JSON array of findings (or `{ "findings": [...] }`).\n\nEach finding must include: `level`, `ruleId`, `severity`, `passed: false`, `message`, optional `fixHint`, optional `metadata.confidence` (`high`|`medium`|`low`).\n\nThe digest includes `phase` (`pre-ab` or `post-ab`) and `llmReviewChecklist`.\n\n**Only emit findings for failed checks** (`passed: false`) whose `ruleId` is in `llmReviewChecklist`. **Do not emit passing rules** \u2014 no `passed: true` entries, no praise, no compliance summaries. Objective static rules (frontmatter, bundled paths, script shape heuristics, line counts) already ran separately \u2014 do not duplicate them.\n\nWhen `phase` is `pre-ab`:\n\n- **Document-quality base rules** (always in checklist): `L0.primary_action`, `L0.output_contract`, `L0.description_trigger_quality`, `L0.package_layout`, `L1.scope_creep.semantic`, `L2.negative_constraints`, `L2.verification_binding`, `L2.gotchas_presence`, `L2.gotcha_specificity`, `L2.failure_branch_hint`. Judge semantics in **Chinese or English** (e.g. `## \u5DE5\u4F5C\u6D41` counts as workflow; `\u7981\u6B62` counts as negative constraints).\n- **Corpus base rules** (when present): `L1.intention_drift.semantic` when `intention` is non-empty; `L1.cross_reference.semantic` when `corpusSummary.questionCount >= 1`. When the package has `scripts/`, also base: `L1.method_vs_answer`.\n- **Escalation rules** (only when listed): e.g. `L2.over_railroading` when MUST density static fired; `L2.gotcha_specificity.semantic` when Gotchas section is long enough for a deeper pass.\n- Emit a finding only when the check fails (`passed: false`). Put the diagnosis in `message` and concrete edits in `fixHint`. Use severities from the rule: L0.primary_action / L0.output_contract / contamination rules \u2192 `error` when failed; most L2 doc rules \u2192 `warning` when failed.\n- Set `severity: error` with `metadata.confidence: high` for clear leakage/drift failures.\n\nWhen `phase` is `post-ab`:\n\n- Emit only failed checks (`passed: false`); omit passing rules.\n- Digest may include static findings, AB grader summaries, and transcript excerpts.\n- Do not re-report document-only rules already covered in pre-AB unless explicitly in checklist.\n- `L3.gotcha_consumption` checks runtime behavior when Gotchas exist \u2014 not document presence.\n- Post-AB severities should be `warning` unless noted otherwise.\n\nDo not call tools. Do not rewrite the skill. Return JSON only.\n\n## Tool Usage Guidelines\n\nWhen searching for files, always prefer the Glob tool. Do not use find or ls for file search. Use Grep for content search, Read for reading files, and Edit for editing files. Avoid Bash for file operations unless truly necessary.';function r3(){return{"evolve-v3-skill-lens-reviewer":{description:"Independent Skill Lens reviewer (pre-AB and post-AB). Use only via evolve pipeline digest; do not load as a task skill.",prompt:Tc,mode:"subagent",permission:{"*":"deny",read:"allow",glob:"allow",grep:"allow",list:"allow"}}}}function g5(){return{...g3(),...P3(),...l3(),...p3(),...e3(),...I3(),...r3()}}import{createHash as t1}from"crypto";var P1=Object.freeze({probeIntervalMs:3000,progressIntervalMs:60000,outputWarningMs:15000,stalledMs:0,hardTimeoutMs:3600000,maxConsecutiveProbeErrors:5});function $h(h){return typeof h==="object"&&h!==null&&!Array.isArray(h)?h:void 0}function l1(h){if(h==="busy"||h==="retry"||h==="idle"||h==="unknown"||h==="deleted")return h;return"missing"}function p1(h){if(typeof h==="number"&&Number.isFinite(h))return h;if(typeof h==="string"&&h.trim()){let f=Number(h);if(Number.isFinite(f))return f;let _=Date.parse(h);if(Number.isFinite(_))return _}return}function xc(h){if(typeof h==="string")return`string:${h}`;if(typeof h==="number"&&Number.isFinite(h))return`number:${h}`;return"invalid"}var e1=64;function Rf(h,f=e1){if(typeof h!=="string")return;let _=h.trim().replace(/\s+/g,"_").replace(/[^\w.-]/g,"");if(!_)return;return _.length<=f?_:_.slice(0,f)}function r1(h){if(typeof h==="string")return h.length;return 0}function a1(h){let f=h.tool;if(typeof f==="string")return Rf(f,32)??"tool";let _=$h(f);if(typeof _?.name==="string")return Rf(_.name,32)??"tool";return"tool"}function i1(h){if(typeof h.id==="string"&&h.id)return h.id;if(typeof h.callID==="string"&&h.callID)return h.callID;if(typeof h.partID==="string"&&h.partID)return h.partID;return}function a3(h){let f=$h(h);if(!f)return;let _=$h(f.properties),n=$h(_?.info),c=$h(_?.part),b=$h(f.info),y=$h(f.part),u=[_?.sessionID,n?.sessionID,c?.sessionID,f.sessionID,b?.sessionID,y?.sessionID],U=new Set(u.filter(($)=>typeof $==="string"&&$.length>0));if(U.size!==1)return;return U.values().next().value}class Cc{sessionID;requestLogFilePath;thresholds;probe;now;scheduleInterval;cancelInterval;onOutputWarning;onTermination;progressContext;intervalHandle;failureResolver;failurePromise;hasStarted=!1;finalized=!1;running=!1;probing=!1;startedAt=0;lastOutputAt=0;lastActivityAt=0;lastProgressLogAt=0;outputCharCount=0;lastProgressOutputCharCount=0;activityEventCount=0;retryNotBeforeAt;retryAttempt;retryMessage;statusType="missing";lifecycle="starting";everActive=!1;assistantCompleted=!1;artifactComplete=!1;consecutiveProbeErrors=0;outputWarningEmitted=!1;failure;retrySignature;toolStates=new Map;toolNames=new Map;partTextLengths=new Map;finalizeListeners=new Set;constructor(h){if(!h.sessionID.trim())throw Error("sessionID is required");if(!h.requestLogFilePath.trim())throw Error("requestLogFilePath is required");this.sessionID=h.sessionID,this.requestLogFilePath=h.requestLogFilePath,this.probe=h.probe,this.progressContext=h.progressContext;let f={...P1,...h.thresholds};for(let _ of["probeIntervalMs","progressIntervalMs","outputWarningMs","hardTimeoutMs"])if(!Number.isFinite(f[_])||f[_]<=0)throw Error(`Invalid heartbeat threshold ${_}: expected a finite positive number`);if(!Number.isFinite(f.stalledMs)||f.stalledMs<0)throw Error("Invalid heartbeat threshold stalledMs: expected a finite number >= 0 (0 disables stalled kill)");if(!Number.isFinite(f.maxConsecutiveProbeErrors)||!Number.isInteger(f.maxConsecutiveProbeErrors)||f.maxConsecutiveProbeErrors<=0)throw Error("Invalid heartbeat threshold maxConsecutiveProbeErrors: expected a positive integer");this.thresholds=Object.freeze(f),this.now=h.now??Date.now,this.scheduleInterval=h.setInterval??((_,n)=>setInterval(_,n)),this.cancelInterval=h.clearInterval??((_)=>clearInterval(_)),this.onOutputWarning=h.onOutputWarning,this.onTermination=h.onTermination,this.failurePromise=new Promise((_)=>{this.failureResolver=_})}start(){if(this.running)return this;if(this.hasStarted)throw Error(`SessionHeartbeatMonitor is single-use and cannot be restarted: ${this.sessionID}`);this.hasStarted=!0;let h=this.now();return this.running=!0,this.startedAt=h,this.lastOutputAt=h,this.lastActivityAt=h,this.lastProgressLogAt=h,this.lifecycle="starting",this.log(`heartbeat_monitor_start sessionId=${this.sessionID} probeIntervalMs=${this.thresholds.probeIntervalMs} progressIntervalMs=${this.thresholds.progressIntervalMs} outputWarningMs=${this.thresholds.outputWarningMs} stalledMs=${this.thresholds.stalledMs} hardTimeoutMs=${this.thresholds.hardTimeoutMs}`),this.intervalHandle=this.scheduleInterval(()=>{if(this.checkNow(),this.running&&this.probe)this.probeNow()},this.thresholds.probeIntervalMs),this}stop(h="stopped"){if(!this.running)return;if(this.running=!1,this.clearScheduledInterval(),!this.failure)this.lifecycle="stopped";this.log(`session_attempt_final sessionId=${this.sessionID} outcome=${h} everActive=${this.everActive} elapsedMs=${Math.max(0,this.now()-this.startedAt)}`),this.finalize()}waitForFailure(){return this.failurePromise}onFinalize(h){if(this.finalized){try{h()}catch{}return()=>!1}this.finalizeListeners.add(h);let f=!0;return()=>{if(!f)return!1;return f=!1,this.finalizeListeners.delete(h)}}snapshot(){let h=0;for(let f of this.toolStates.values())if(f==="running")h++;return{sessionID:this.sessionID,running:this.running,lifecycle:this.lifecycle,statusType:this.statusType,everActive:this.everActive,assistantCompleted:this.assistantCompleted,artifactComplete:this.artifactComplete,completionCandidate:this.statusType==="idle"||this.everActive&&(this.statusType==="missing"||this.statusType==="unknown"),startedAt:this.startedAt,lastOutputAt:this.lastOutputAt,lastActivityAt:this.lastActivityAt,retryNotBeforeAt:this.retryNotBeforeAt,consecutiveProbeErrors:this.consecutiveProbeErrors,runningToolCount:h,outputCharCount:this.outputCharCount,activityEventCount:this.activityEventCount,retryAttempt:this.retryAttempt,retryMessage:this.retryMessage,outputWarningEmitted:this.outputWarningEmitted,failure:this.failure}}async probeNow(){if(!this.running||!this.probe||this.probing)return;this.probing=!0;try{let h=await this.probe();if(!this.running)return;this.consecutiveProbeErrors=0,this.recordStatus(h),this.checkNow()}catch{if(!this.running)return;if(this.checkNow(),!this.running)return;if(this.consecutiveProbeErrors++,this.consecutiveProbeErrors>=this.thresholds.maxConsecutiveProbeErrors)this.terminate("probe_error")}finally{this.probing=!1}}recordEvent(h){if(!this.running||a3(h)!==this.sessionID)return!1;let f=$h(h);if(!f)return!1;let _=$h(f.properties)??{};switch(f.type){case"session.status":this.recordStatus(_.status??f.info);break;case"message.updated":{let n=$h(_.info??f.info),c=$h(n?.time);if(n?.role==="assistant"){if(c?.completed!=null)this.assistantCompleted=!0;this.markActivity(),this.incrementActivityEvents()}break}case"message.part.updated":this.recordPart(_.part??f.part);break;case"message.part.delta":this.recordDelta(_);break;case"session.error":this.terminate("session_error");break;case"session.deleted":this.statusType="deleted",this.terminate("session_lost");break;default:return!1}return!0}markArtifactComplete(){if(!this.running)return!1;return this.artifactComplete=!0,this.markActivity(),!0}checkNow(){if(!this.running)return;let h=this.now();if(h-this.startedAt>=this.thresholds.hardTimeoutMs){this.terminate("hard_timeout");return}if(this.maybeEmitProgress(),!this.outputWarningEmitted&&h-this.lastOutputAt>=this.thresholds.outputWarningMs){if(this.outputWarningEmitted=!0,this.statusType==="retry")this.log(this.formatRetryStallWarning(h));else this.log(`output_stalled_warning sessionId=${this.sessionID} noOutputMs=${h-this.lastOutputAt} runningTools=${this.runningToolCount()}`);try{this.onOutputWarning?.(this.snapshot())}catch{}}let f=Math.max(this.lastActivityAt,this.retryNotBeforeAt??Number.NEGATIVE_INFINITY);if(this.thresholds.stalledMs>0&&this.runningToolCount()===0&&h-f>=this.thresholds.stalledMs)this.terminate("stalled")}recordStatus(h){let f=$h(h),_=l1(f?.type),n=this.statusType;if(this.statusType=_,_==="busy"){if(this.everActive=!0,this.lifecycle="active",this.retryNotBeforeAt=void 0,this.retrySignature=void 0,this.retryAttempt=void 0,this.retryMessage=void 0,n!=="busy")this.markActivity(),this.incrementActivityEvents();return}if(_==="retry"){this.everActive=!0,this.lifecycle="active";let c=f?.attempt;this.retryAttempt=typeof c==="number"&&Number.isFinite(c)?c:void 0,this.retryMessage=Rf(f?.message);let b=[xc(f?.attempt),xc(f?.message),xc(f?.next)].join("|");if(n!=="retry"||b!==this.retrySignature)this.markActivity(),this.incrementActivityEvents();this.retrySignature=b,this.retryNotBeforeAt=p1(f?.next),this.maybeEmitProgress(!0);return}if(this.retrySignature=void 0,this.retryNotBeforeAt=void 0,this.retryAttempt=void 0,this.retryMessage=void 0,_==="idle"){if(this.lifecycle="idle",n!=="idle")this.markActivity(),this.incrementActivityEvents();return}if(_==="deleted"){this.terminate("session_lost");return}this.lifecycle=this.everActive?"draining":"starting"}recordDelta(h){let f=h.delta,_=r1(f);if(_===0)return;let n=$h(h.part)?.type??h.part_type,c=h.field;if(c==="text"||c==="thinking"||c==="reasoning"||n==="text"||n==="reasoning"||n==="thinking")this.addOutputChars(_)}recordPart(h){let f=$h(h);if(!f)return;if(f.type==="text"||f.type==="reasoning"||f.type==="thinking"){if(typeof f.text==="string"&&f.text.length>0){let c=i1(f);if(c){let b=this.partTextLengths.get(c)??0;if(f.text.length>b)this.addOutputChars(f.text.length-b),this.partTextLengths.set(c,f.text.length)}else this.addOutputChars(f.text.length)}return}if(f.type!=="tool"||typeof f.callID!=="string"||!f.callID)return;let _=$h(f.state)?.status;if(_!=="pending"&&_!=="running"&&_!=="completed"&&_!=="error")return;let n=this.toolStates.get(f.callID);if(this.toolStates.set(f.callID,_),this.toolNames.set(f.callID,a1(f)),n!==_)this.markActivity(),this.incrementActivityEvents()}addOutputChars(h){if(h<=0)return;this.outputCharCount+=h,this.incrementActivityEvents(),this.markOutput()}incrementActivityEvents(){this.activityEventCount++}maybeEmitProgress(h=!1){if(!this.running)return;let f=this.now();if(!h&&f-this.lastProgressLogAt<this.thresholds.progressIntervalMs)return;this.emitProgress(f)}emitProgress(h){let f=this.outputCharCount-this.lastProgressOutputCharCount;this.lastProgressOutputCharCount=this.outputCharCount,this.lastProgressLogAt=h,this.log(this.formatProgressLine(h,f))}formatProgressLine(h,f){let _=this.progressContext;return["heartbeat_progress",_?.stage?`stage=${Rf(_.stage,48)??"unknown"}`:void 0,_?.questionId?`question=${Rf(_.questionId,48)??"unknown"}`:void 0,_?.role?`role=${Rf(_.role,48)??"unknown"}`:void 0,`sessionId=${this.sessionID}`,`status=${this.statusType}`,this.statusType==="retry"&&this.retryAttempt!=null?`retryAttempt=${this.retryAttempt}`:void 0,this.statusType==="retry"&&this.retryNotBeforeAt!=null?`retryNextMs=${Math.max(0,this.retryNotBeforeAt-h)}`:void 0,this.statusType==="retry"&&this.retryMessage?`retryMessage=${this.retryMessage}`:void 0,`outputChars=${this.outputCharCount}`,`outputDelta=${f}`,`activityEvents=${this.activityEventCount}`,`runningTools=${this.runningToolCount()}`,this.formatRunningToolSummary(),`noOutputMs=${Math.max(0,h-this.lastOutputAt)}`,`idleMs=${Math.max(0,h-this.lastActivityAt)}`].filter((c)=>c!=null).join(" ")}formatRunningToolSummary(){let h=[];for(let[f,_]of this.toolStates.entries()){if(_!=="running")continue;let n=this.toolNames.get(f)??"tool";if(h.push(`${n}:${_}`),h.length>=8)break}return h.length>0?`tools=${h.join(",")}`:void 0}formatRetryStallWarning(h){return["output_stalled_during_retry",`sessionId=${this.sessionID}`,`noOutputMs=${h-this.lastOutputAt}`,`runningTools=${this.runningToolCount()}`,this.retryAttempt!=null?`retryAttempt=${this.retryAttempt}`:void 0,this.retryNotBeforeAt!=null?`retryNextMs=${Math.max(0,this.retryNotBeforeAt-h)}`:void 0,this.retryMessage?`retryMessage=${this.retryMessage}`:void 0].filter((_)=>_!=null).join(" ")}markOutput(){let h=this.now();this.lastOutputAt=h,this.lastActivityAt=h,this.outputWarningEmitted=!1}markActivity(){this.lastActivityAt=this.now()}runningToolCount(){let h=0;for(let f of this.toolStates.values())if(f==="running")h++;return h}terminate(h){if(!this.running||this.failure)return;let f={reason:h,sessionID:this.sessionID,at:this.now()};this.failure=f,this.lifecycle="terminated",this.log(`termination_triggered sessionId=${this.sessionID} reason=${h} everActive=${this.everActive} elapsedMs=${Math.max(0,f.at-this.startedAt)}`),this.running=!1,this.clearScheduledInterval(),this.log(`session_attempt_final sessionId=${this.sessionID} outcome=${h} everActive=${this.everActive} elapsedMs=${Math.max(0,f.at-this.startedAt)}`),this.failureResolver(f);try{this.onTermination?.(f)}catch{}this.finalize()}finalize(){if(this.finalized)return;this.finalized=!0;let h=[...this.finalizeListeners];this.finalizeListeners.clear();for(let f of h)try{f()}catch{}}clearScheduledInterval(){if(this.intervalHandle===void 0)return;this.cancelInterval(this.intervalHandle),this.intervalHandle=void 0}log(h){try{Y(`[session-heartbeat] ${h}`,this.requestLogFilePath)}catch{}}}class i3{monitors=new Map;register(h){let f=this.monitors.get(h.sessionID);if(f&&f.monitor!==h)throw Error(`A heartbeat monitor is already registered for session ${h.sessionID}`);if(!f){let _={monitor:h,unsubscribeFinalize:()=>!1};this.monitors.set(h.sessionID,_),_.unsubscribeFinalize=h.onFinalize(()=>{this.unregister(h.sessionID,h)})}return()=>this.unregister(h.sessionID,h)}unregister(h,f){let _=this.monitors.get(h);if(!_||f&&_.monitor!==f)return!1;return this.monitors.delete(h),_.unsubscribeFinalize(),!0}get(h){return this.monitors.get(h)?.monitor}dispatch(h){let f=a3(h);if(!f)return!1;return this.monitors.get(f)?.monitor.recordEvent(h)??!1}}var Sf=new i3;var o1=new Set(["session.status","message.updated","message.part.updated","message.part.delta","session.error","session.deleted"]);function Uh(h){return typeof h==="object"&&h!==null&&!Array.isArray(h)?h:void 0}function s1(h){let f=Uh(h),_=Uh(f?.response),n=f?.status??f?.statusCode??_?.status;return typeof n==="number"?n:void 0}function s3(h){return s1(h)===404}function h$(h){let f=h instanceof Error?h.message:"";return/\b(path|sessionID|argument|input)\b.*\b(required|expected|invalid|missing)\b/i.test(f)||/\b(required|expected|invalid|missing)\b.*\b(path|sessionID|argument|input)\b/i.test(f)}async function t3(h,f){try{return await h({sessionID:f},{throwOnError:!0})}catch(_){if(s3(_)||!h$(_))throw _;return h({path:{id:f}},{throwOnError:!0})}}function hb(h){return Uh(h)?.data}function f$(h,f){let _=Uh(hb(h));return Uh(_?.[f])}function _$(h){let f=h.length.toString(16).padStart(14,"0"),_=t1("sha256").update(h).digest("hex");return`v1:${f}:${_}`}function uf(h){if(h===void 0)return"undefined";if(h===null)return"null";if(typeof h==="string")return`string:${h}`;if(typeof h==="number")return Number.isFinite(h)?`number:${h}`:"number:invalid";if(typeof h==="boolean")return`boolean:${h}`;return`type:${typeof h}`}function n$(h,f,_){let n=f?.id??h.id;return typeof n==="string"&&n?`id:${n}`:`index:${_}`}function c$(h){let f=Uh(h?.time);return[uf(h?.role),uf(f?.completed)].join("|")}function y$(h,f,_){let n=h.id;if(typeof n==="string"&&n)return`${f}|id:${n}`;let c=h.callID;if(typeof c==="string"&&c)return`${f}|call:${c}`;return`${f}:index:${_}`}function o3(h,f){let _=f.get(h)??0;return f.set(h,_+1),`${h}|occurrence:${_}`}function b$(h){let f=h.type;if(f==="text"||f==="reasoning"||f==="thinking"){let _=typeof h.text==="string"?_$(h.text):uf(h.text);return`${uf(f)}|${_}`}if(f==="tool")return[uf(f),uf(h.callID),uf(Uh(h.state)?.status)].join("|");return uf(f)}function u$(h,f,_,n){let c=hb(h);if(!Array.isArray(c))return;let b=new Map,y=new Map,u=new Set,U=new Set;for(let[$,j]of c.entries()){let J=Uh(j);if(!J)continue;let K=Uh(J.info);if(K?.role!=="assistant")continue;let G=o3(n$(J,K,$),b);u.add(G);let Z=c$(K);if(n.messages.get(G)!==Z)n.messages.set(G,Z),_.dispatch({type:"message.updated",properties:{sessionID:f,info:K}});if(!Array.isArray(J.parts))continue;for(let[z,W]of J.parts.entries()){let w=Uh(W);if(!w)continue;let v=o3(y$(w,G,z),y);U.add(v);let X=b$(w);if(n.parts.get(v)!==X)n.parts.set(v,X),_.dispatch({type:"message.part.updated",properties:{sessionID:f,part:w}})}}for(let $ of n.messages.keys())if(!u.has($))n.messages.delete($);for(let $ of n.parts.keys())if(!U.has($))n.parts.delete($)}function $$(h,f=Sf){let _=Uh(h);if(typeof Uh(_?.session)?.status!=="function")throw Error("session.status is required for heartbeat monitoring");let c=h,b=new Map;return async(y)=>{let u=await c.session.status({}),U=f$(u,y);if(!U&&c.session.get)try{await t3(c.session.get.bind(c.session),y)}catch($){if(s3($))return{type:"deleted"};throw $}if(c.session.messages){let $=await t3(c.session.messages.bind(c.session),y),j=b.get(y);if(!j)j={messages:new Map,parts:new Map},b.set(y,j);u$($,y,f,j)}if(U)return U;return{type:"missing"}}}function dh(h,f,_=Sf){let n=h,c={heartbeat:{probe:$$(n,_)}};if(n.session.abort){let b=n.session.abort.bind(n.session);c.abortSession=async(y)=>{let u=f.targetShape==="sdk"?{sessionID:y}:{path:{id:y}};await b(u,{throwOnError:!0})}}return c}var wf=new WeakMap;function U$(h){let _=Uh(h)?.stream??h;if(typeof _?.[Symbol.asyncIterator]==="function")return _;return}function j$(h){return Uh(h)?.event??h}function Y$(h){let f=Uh(h)?.type;return typeof f==="string"?f:void 0}function J$(h){if(h instanceof Error)return/^[A-Za-z][A-Za-z0-9_.-]{0,63}$/.test(h.name)?h.name:"Error";if(h===null)return"null";return typeof h}function Yn(h,f,_){let n=`[session-heartbeat-bridge] ${f} errorType=${J$(_)}`;for(let c of h.loggers.keys())try{c(n)}catch{}}async function K$(h,f,_){try{let n=h.event?.subscribe;if(!n)return;let c=await n({}),b=U$(c);if(!b)throw Error("Event subscription did not provide an async stream");let y=b[Symbol.asyncIterator]();if(_.iterator=y,_.stopped){await y.return?.();return}while(!_.stopped){let u=await y.next();if(u.done||_.stopped)break;let U=j$(u.value),$=Y$(U);if(!$||!o1.has($))continue;for(let j of _.registries.keys())try{j.dispatch(U)}catch(J){Yn(_,"event_dispatch_error",J)}}}catch(n){if(!_.stopped)Yn(_,"event_stream_error",n)}finally{if(_.ended=!0,wf.get(f)===_)wf.delete(f)}}function fb(h,f=Sf,_){let n=h,c=h,b=wf.get(c);if(b?.ended)wf.delete(c),b=void 0;if(!b)b={references:0,stopped:!1,ended:!1,registries:new Map,loggers:new Map},wf.set(c,b),K$(n,c,b);if(b.references++,b.registries.set(f,(b.registries.get(f)??0)+1),_)b.loggers.set(_,(b.loggers.get(_)??0)+1);let y=b,u=!1;return()=>{if(u)return;u=!0,y.references--;let U=(y.registries.get(f)??1)-1;if(U>0)y.registries.set(f,U);else y.registries.delete(f);if(_){let $=(y.loggers.get(_)??1)-1;if($>0)y.loggers.set(_,$);else y.loggers.delete(_)}if(y.references>0)return;if(y.references=0,y.stopped=!0,y.registries.clear(),y.loggers.clear(),wf.get(c)===y)wf.delete(c);if(y.ended)return;try{y.iterator?.return?.().catch(($)=>Yn(y,"event_stream_stop_error",$))}catch($){Yn(y,"event_stream_stop_error",$)}}}function nJ(h,f){try{return h.dispatch(f)}catch{return!1}}import{AsyncLocalStorage as ub}from"async_hooks";import ih from"fs";import Rc from"path";var G$=[/Test\.java$/,/Tests\.java$/,/IT\.java$/,/\.test\.tsx?$/,/\.spec\.tsx?$/,/_test\.go$/,/test_.*\.py$/,/.*_test\.py$/],W$={".ts":"TypeScript",".tsx":"TypeScript",".js":"JavaScript",".jsx":"JavaScript",".java":"Java",".py":"Python",".go":"Go",".rs":"Rust",".rb":"Ruby",".c":"C",".cpp":"C++",".cc":"C++",".h":"C",".hpp":"C++",".cs":"C#",".swift":"Swift",".kt":"Kotlin",".scala":"Scala",".php":"PHP",".sh":"Shell",".bash":"Shell",".zsh":"Shell",".json":"JSON",".yaml":"YAML",".yml":"YAML",".toml":"TOML",".xml":"XML",".html":"HTML",".css":"CSS",".scss":"SCSS",".sql":"SQL",".md":"Markdown"};function Z$(h){let f=h.toLowerCase();if(f.includes("exit code"))return"command_failed";if(f.includes("string to replace not found")||f.includes("no changes"))return"edit_failed";if(f.includes("file not found")||f.includes("does not exist"))return"file_not_found";if(f.includes("exceeds maximum")||f.includes("too large"))return"file_too_large";if(f.includes("modified since read"))return"file_changed";if(f.includes("rejected")||f.includes("doesn't want"))return"user_rejected";return"other"}function X$(h){return G$.some((f)=>f.test(h))}function z$(h){let f=h.match(/\.[^.]+$/);if(!f)return"Unknown";return W$[f[0]]??"Unknown"}function _b(h){if(!h)return;let f=h.filePath??h.file_path??h.path;return typeof f==="string"?f:void 0}function w$(h){if(!h)return"";let f=_b(h);if(f)return f;let _=h.command??h.cmd;if(typeof _==="string")return _;return JSON.stringify(h).slice(0,200)}function $f(h){let f=(h.time.updated-h.time.created)/1000,_=0,n=0,c={},b=[],y=[],u={input:0,output:0,reasoning:0,cacheRead:0,cacheWrite:0},U=0;for(let $ of h.messages){if($.info.role==="user")_++;if($.info.role==="assistant")n++;if($.info.tokens)u.input+=$.info.tokens.input??0,u.output+=$.info.tokens.output??0,u.reasoning+=$.info.tokens.reasoning??0,u.cacheRead+=$.info.tokens.cache?.read??0,u.cacheWrite+=$.info.tokens.cache?.write??0;if($.info.cost)U+=$.info.cost;for(let j of $.parts)if(j.type==="tool"&&j.tool){if(c[j.tool]=(c[j.tool]??0)+1,j.state?.status==="error"&&j.state.error)b.push({tool:j.tool,input:w$(j.state.input),error:j.state.error,category:Z$(j.state.error)});if((j.tool==="edit"||j.tool==="write")&&j.state?.status==="completed"){let J=_b(j.state.input);if(J)y.push({file:J,tool:j.tool,isTestFile:X$(J),language:z$(J)})}}}return{duration:f,userMessageCount:_,assistantMessageCount:n,toolCounts:c,toolErrors:b,filesModified:y,totalTokens:u,totalCost:U}}import{Database as Q$}from"bun:sqlite";function nb(h){return{type:h.type,text:h.text,tool:h.tool,callID:h.callID,state:h.state?{status:h.state.status,input:h.state.input,output:h.state.output,title:h.state.title,error:h.state.error,metadata:h.state.metadata}:void 0,hash:h.hash,files:h.files,synthetic:h.synthetic}}function v$(h,f){return{info:{role:h.role,agent:h.agent,modelID:h.model?.modelID,providerID:h.model?.providerID,cost:h.cost,tokens:h.tokens?{input:h.tokens.input??0,output:h.tokens.output??0,reasoning:h.tokens.reasoning??0,cache:{read:h.tokens.cache?.read??0,write:h.tokens.cache?.write??0}}:void 0,time:h.time},parts:f}}function H$(h,f){let _=h.query("SELECT id, data FROM message WHERE session_id = ? ORDER BY time_created").all(f);if(!_.length)return[];let n=_.map((u)=>u.id),c=n.map(()=>"?").join(","),b=h.query(`SELECT data, message_id FROM part WHERE message_id IN (${c}) ORDER BY time_created`).all(...n),y=new Map;for(let u of b){let U=y.get(u.message_id);if(U)U.push(nb(JSON.parse(u.data)));else y.set(u.message_id,[nb(JSON.parse(u.data))])}return _.map((u)=>{let U=JSON.parse(u.data),$=y.get(u.id)??[];return v$(U,$)})}function d$(h,f){return{id:h.id,title:h.title??"",directory:h.directory??"",time:{created:h.time_created,updated:h.time_updated},summary:h.summary_additions!=null?{additions:h.summary_additions,deletions:h.summary_deletions??0,files:h.summary_files??0}:void 0,messages:f}}function yb(h,f){let _=new Q$(h,{readonly:!0});try{let n=_.query("SELECT id, directory, title, time_created, time_updated, summary_additions, summary_deletions, summary_files FROM session WHERE id = ?").get(f);if(!n)return;let c=H$(_,f);return d$(n,c)}finally{_.close()}}function Qf(h,f){let _=cb(h);console.log(`[skill-evolver][session-db] readSessionFromDbCandidates scan ${ah(h)} sessionId=${f}`);for(let n of _){if(!n)continue;try{let c=yb(n,f);if(c)return console.log(`[skill-evolver][session-db] readSessionFromDbCandidates hit sessionId=${f} db=${n} messageCount=${c.messages?.length??0}`),c}catch{}}console.log(`[skill-evolver][session-db] readSessionFromDbCandidates miss sessionId=${f} tried=${_.join(", ")||"(none)"}`);return}function vf(h){return h.input+h.output+h.reasoning+Math.floor(h.cacheRead/4)+h.cacheWrite}class Vh extends Error{consumed;limit;windowId;constructor(h){super(`Token budget exceeded: consumed=${h.consumed} limit=${h.limit} window=${h.windowId}`+(h.skillName?` skill=${h.skillName}`:"")+(h.stage?` stage=${h.stage}`:""));this.name="TokenBudgetExceededError",this.consumed=h.consumed,this.limit=h.limit,this.windowId=h.windowId}}class Jn{maxTokens;windowId;consumed;subagentCallCount;abortController=new AbortController;exceeded=!1;constructor(h,f){if(this.maxTokens=h,this.windowId=f?.windowId??"",this.consumed=f?.consumed??0,this.subagentCallCount=f?.subagentCallCount??0,f?.maxTokens!==void 0);if(this.maxTokens>0&&this.consumed>=this.maxTokens)this.exceeded=!0,this.abortController.abort()}get signal(){return this.abortController.signal}get isUnlimited(){return this.maxTokens<=0}get currentWindowId(){return this.windowId}get totalConsumed(){return this.consumed}get remaining(){if(this.isUnlimited)return Number.POSITIVE_INFINITY;return Math.max(0,this.maxTokens-this.consumed)}get callCount(){return this.subagentCallCount}isExceeded(){return this.exceeded||!this.isUnlimited&&this.consumed>=this.maxTokens}resetWindow(h){this.windowId=h,this.consumed=0,this.subagentCallCount=0,this.exceeded=!1,this.abortController=new AbortController}loadWindowState(h){if(this.windowId=h.windowId,this.consumed=h.consumed,this.subagentCallCount=h.subagentCallCount,this.exceeded=!this.isUnlimited&&this.consumed>=this.maxTokens,this.exceeded&&!this.abortController.signal.aborted)this.abortController.abort()}toState(){return{windowId:this.windowId,consumed:this.consumed,subagentCallCount:this.subagentCallCount,maxTokens:this.maxTokens}}assertCanStartSession(h){if(this.isUnlimited)return;if(this.isExceeded())this.triggerExceeded(h)}recordSubagentCall(h,f){if(this.isUnlimited)return;let _=vf(h);if(this.consumed+=_,this.subagentCallCount+=1,this.logSubagentCall(_,f),this.consumed>=this.maxTokens)this.triggerExceeded(f)}triggerExceeded(h){if(!this.exceeded){if(this.exceeded=!0,!this.abortController.signal.aborted)this.abortController.abort();console.log(`[evolve-audit] budget.exceeded ${JSON.stringify({skillName:h?.skillName,stage:h?.stage,sessionId:h?.sessionId,consumed:this.consumed,limit:this.maxTokens,windowId:this.windowId,action:"abort"})}`)}throw new Vh({consumed:this.consumed,limit:this.maxTokens,windowId:this.windowId,skillName:h?.skillName,stage:h?.stage})}logSubagentCall(h,f){console.debug(`[evolve-audit] budget.subagent_call ${JSON.stringify({skillName:f?.skillName,stage:f?.stage,sessionId:f?.sessionId,deltaTokens:h,consumedAfter:this.consumed,remaining:this.remaining,subagentCallCount:this.subagentCallCount})}`)}}function Vc(h,f=!1){console.log(`[evolve-audit] budget.window ${JSON.stringify({windowId:h.currentWindowId,maxTokens:h.isUnlimited?0:h.toState().maxTokens,consumed:h.totalConsumed,remaining:h.isUnlimited?"unlimited":h.remaining,reset:f})}`)}function j_(){return{input:0,output:0,reasoning:0,cacheRead:0,cacheWrite:0,cost:0}}function Df(){return{reasoning:0,text:0}}function O$(h,f){return{input:h.input+f.input,output:h.output+f.output,reasoning:h.reasoning+f.reasoning,cacheRead:h.cacheRead+f.cacheRead,cacheWrite:h.cacheWrite+f.cacheWrite,cost:h.cost+f.cost}}function B$(h,f){return{reasoning:h.reasoning+f.reasoning,text:h.text+f.text}}function $b(h){let f=Df();for(let _ of h.messages){if(_.info.role!=="assistant")continue;for(let n of _.parts){let c=n.text;if(typeof c!=="string"||c.length===0)continue;if(n.type==="reasoning"||n.type==="thinking")f.reasoning+=c.length;else if(n.type==="text")f.text+=c.length}}return f}function A$(){return`obs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`}function T$(h,f,_){return{schemaVersion:2,entry:h,roundId:f,attemptId:f,status:"running",startedAt:_,token_usage:{total:j_(),byStage:[]},char_usage:{total:Df()},time_consuming:{totalMs:0,byStage:[]},watchdog_incidents:{counts:{warning:0,stalled:0,timeout:0},byReason:{},events:[]}}}function U_(h,f){let _=Rc.dirname(h);ih.mkdirSync(_,{recursive:!0}),ih.writeFileSync(h,`${JSON.stringify(f,null,2)}
`,"utf-8")}class Sc{data;persistEnabled;finalized=!1;constructor(h){let f=new Date().toISOString(),_=h.attemptId??h.roundId??A$();if(this.persistEnabled=h.persist!==!1,this.data=T$(h.entry,_,f),h.skillName)this.data.skillName=h.skillName;if(h.version!==void 0)this.data.version=h.version,this.data.candidateVersion=h.version;if(h.sourceSessionId)this.data.sourceSessionId=h.sourceSessionId;if(this.persist(),this.persistEnabled&&h.skillName?.trim())Kn({skillName:h.skillName,excludeAttemptIds:[this.data.attemptId],reason:"superseded_by_new_attempt"})}get attemptId(){return this.data.attemptId}get primaryPath(){return Mc(this.data.attemptId)}bindSkillVersion(h,f){if(this.data.skillName=h.trim(),f!==void 0&&Number.isFinite(f))this.data.version=f,this.data.candidateVersion=f;this.persist()}setSkillNames(h){this.data.skillNames=[...h],this.persist()}setSourceSessionId(h){this.data.sourceSessionId=h,this.persist()}recordStage(h){let f=h.readTokens!==!1&&h.sessionId?Yb(h.sessionId):{tokens:j_(),chars:Df()},_=new Date().toISOString(),n={stage:h.stage,questionId:h.questionId,role:h.role,sessionId:h.sessionId,ok:h.ok,attempts:h.attempts,elapsedMs:Math.max(0,h.elapsedMs),tokens:f.tokens,chars:f.chars,recordedAt:_};this.data.token_usage.byStage.push(n),this.data.token_usage.total=O$(this.data.token_usage.total,f.tokens),this.data.char_usage.total=B$(this.data.char_usage.total,f.chars),this.data.time_consuming.byStage.push({stage:h.stage,questionId:h.questionId,role:h.role,sessionId:h.sessionId,elapsedMs:n.elapsedMs,ok:h.ok}),this.data.time_consuming.totalMs=this.data.time_consuming.byStage.reduce((c,b)=>c+b.elapsedMs,0),this.persist()}recordWatchdogIncident(h){let f=h.kind;if(this.data.watchdog_incidents.counts[f]+=1,h.reason){let _=h.reason;this.data.watchdog_incidents.byReason[_]=(this.data.watchdog_incidents.byReason[_]??0)+1}this.data.watchdog_incidents.events.push({at:new Date().toISOString(),kind:f,reason:h.reason,stage:h.stage,questionId:h.questionId,role:h.role,sessionId:h.sessionId,attempt:h.attempt}),this.persist()}recordFailureReasonOnly(h){let f=h.reason;this.data.watchdog_incidents.byReason[f]=(this.data.watchdog_incidents.byReason[f]??0)+1,this.data.watchdog_incidents.events.push({at:new Date().toISOString(),reason:h.reason,stage:h.stage,questionId:h.questionId,role:h.role,sessionId:h.sessionId,attempt:h.attempt}),this.persist()}recordFailureReason(h){let f=h.reason;this.data.watchdog_incidents.byReason[f]=(this.data.watchdog_incidents.byReason[f]??0)+1,this.data.watchdog_incidents.events.push({at:new Date().toISOString(),kind:"warning",reason:h.reason,stage:h.stage,questionId:h.questionId,role:h.role,sessionId:h.sessionId,attempt:h.attempt}),this.persist()}snapshot(){return structuredClone(this.data)}toSummary(){return{tokenTotal:{...this.data.token_usage.total},charTotal:{...this.data.char_usage.total},totalMs:this.data.time_consuming.totalMs,watchdogCounts:{...this.data.watchdog_incidents.counts},stageCount:this.data.token_usage.byStage.length}}persist(){if(!this.persistEnabled)return;try{let h=this.snapshot();U_(this.primaryPath,h);let f=new Set;if(h.skillName?.trim())f.add(h.skillName.trim());for(let _ of h.skillNames??[])if(_?.trim())f.add(_.trim());for(let _ of f)U_(Ec(_,h.attemptId),h)}catch{}}finalize(h={}){if(h.skillName)this.data.skillName=h.skillName;if(h.version!==void 0)this.data.version=h.version,this.data.candidateVersion=h.version;if(h.skillNames)this.data.skillNames=[...h.skillNames];if(h.outcome)this.data.outcome=h.outcome;if(this.data.status=h.status??(this.data.status==="running"?"completed":this.data.status),this.data.endedAt=new Date().toISOString(),this.finalized=!0,this.persist(),h.outputPath)try{U_(h.outputPath,this.snapshot())}catch{}return this.snapshot()}get isFinalized(){return this.finalized}}var Ub=new ub,jb=new ub;function Hf(){return jb.getStore()}async function Dc(h,f){if(!h)return f();return jb.run(h,f)}function Uf(){return Ub.getStore()}function Kn(h={}){let f=[],_=bb();if(!ih.existsSync(_))return f;let n;try{n=ih.readdirSync(_)}catch{return f}let c=new Set((h.excludeAttemptIds??[]).map((u)=>u.trim()).filter(Boolean)),b=h.skillName?.trim(),y=h.reason?.trim()||"orphan_aborted";for(let u of n){if(!u.endsWith(".json"))continue;let U=Rc.join(_,u);try{let $=JSON.parse(ih.readFileSync(U,"utf-8"));if($.status!=="running")continue;let j=String($.attemptId??u.replace(/\.json$/i,"")).trim();if(!j||c.has(j))continue;if(b&&($.skillName?.trim()??"")!==b)continue;let J={schemaVersion:2,entry:$.entry??"daemon",roundId:$.roundId??j,attemptId:j,status:"aborted",startedAt:$.startedAt??new Date().toISOString(),endedAt:new Date().toISOString(),outcome:y,token_usage:$.token_usage??{total:j_(),byStage:[]},char_usage:$.char_usage??{total:Df()},time_consuming:$.time_consuming??{totalMs:0,byStage:[]},watchdog_incidents:$.watchdog_incidents??{counts:{warning:0,stalled:0,timeout:0},byReason:{},events:[]},...$.skillName?{skillName:$.skillName}:{},...$.skillNames?{skillNames:$.skillNames}:{},...$.version!==void 0?{version:$.version}:{},...$.candidateVersion!==void 0?{candidateVersion:$.candidateVersion}:{},...$.sourceSessionId?{sourceSessionId:$.sourceSessionId}:{}};U_(U,J);let K=new Set;if(J.skillName?.trim())K.add(J.skillName.trim());for(let G of J.skillNames??[])if(G?.trim())K.add(G.trim());for(let G of K)U_(Ec(G,j),J);f.push(j),console.log(`[evolve-audit] observability.orphan_aborted ${JSON.stringify({attemptId:j,skillName:J.skillName,reason:y})}`)}catch{}}return f}async function Gn(h,f){let _=new Sc(h);return Ub.run(_,()=>f(_))}function Wn(h,f){Uf()?.bindSkillVersion(h,f)}function Zn(h){try{let f=Uf();f?.recordStage(h);let _=Hf();if(_&&h.sessionId&&h.readTokens!==!1){let n=Yb(h.sessionId),c=f?.data.skillName;_.recordSubagentCall(n.tokens,{skillName:c,stage:h.stage,sessionId:h.sessionId})}}catch(f){if(f instanceof Vh)throw f}}function Lc(h){try{Uf()?.recordWatchdogIncident(h)}catch{}}function mc(h){try{Uf()?.recordFailureReasonOnly(h)}catch{}}function Nc(h={}){try{let f=Uf();if(!f)return;return f.finalize(h)}catch{return}}function x$(h){let f=h.trim();if(!f)return;let _=[...Fh(),qc()];return Qf(_,f)}function Yb(h){try{let f=x$(h);if(!f)return{tokens:j_(),chars:Df()};let _=$f(f);return{tokens:{input:_.totalTokens.input,output:_.totalTokens.output,reasoning:_.totalTokens.reasoning,cacheRead:_.totalTokens.cacheRead,cacheWrite:_.totalTokens.cacheWrite,cost:_.totalCost},chars:$b(f)}}catch{return{tokens:j_(),chars:Df()}}}function Fc(h){if(h==="stalled")return"stalled";if(h==="create_timeout"||h==="prompt_timeout")return"timeout";return}function Ic(h,f){let _=Mc(h);if(ih.existsSync(_))try{return JSON.parse(ih.readFileSync(_,"utf-8"))}catch{}if(f){let n=Rc.join(f,"observability.json");if(ih.existsSync(n))try{return JSON.parse(ih.readFileSync(n,"utf-8"))}catch{return}}return}import Xn from"fs";import df from"path";import Gb from"path";var kc=["todowrite","websearch","websearchTool","webfetch","codesearch","browser","lsp","skill"];function Jb(h){return Gb.normalize(h).replaceAll("\\","/")}function Kb(h,f){let _=Jb(h),n=Gb.relative(f,h),c=Jb(n||".");return[_,`${_}/*`,`${_}/**`,c,`${c}/*`,`${c}/**`]}function Wb(h){let{allowedRoots:f,readOnlyRoots:_=[],worktree:n,allowBash:c=!0,readOnly:b=!1}=h,y=[{permission:"edit",pattern:"*",action:"deny"},{permission:"write",pattern:"*",action:"deny"},{permission:"bash",pattern:"*",action:"deny"},{permission:"task",pattern:"*",action:"deny"},{permission:"question",pattern:"*",action:"deny"},{permission:"external_directory",pattern:"*",action:"deny"},{permission:"external_directory_read",pattern:"*",action:"deny"},{permission:"external_directory_write",pattern:"*",action:"deny"}];if(c)y.push({permission:"bash",pattern:"*",action:"allow"});for(let U of kc)y.push({permission:U,pattern:"*",action:"allow"});let u=[...f,..._];for(let U of u){if(!U?.trim())continue;for(let $ of Kb(U,n))y.push({permission:"read",pattern:$,action:"allow"}),y.push({permission:"grep",pattern:$,action:"allow"}),y.push({permission:"glob",pattern:$,action:"allow"}),y.push({permission:"list",pattern:$,action:"allow"}),y.push({permission:"external_directory",pattern:$,action:"allow"}),y.push({permission:"external_directory_read",pattern:$,action:"allow"})}if(!b)for(let U of f){if(!U?.trim())continue;for(let $ of Kb(U,n))y.push({permission:"edit",pattern:$,action:"allow"}),y.push({permission:"write",pattern:$,action:"allow"}),y.push({permission:"external_directory_write",pattern:$,action:"allow"})}return y}var zn=new Map;function wn(h){return df.normalize(h).replaceAll("\\","/")}function C$(h,f){let _=wn(df.resolve(h)),n=wn(df.resolve(f));return _===n||_.startsWith(n.endsWith("/")?n:`${n}/`)}function gc(h){let f=encodeURIComponent(h);return df.join(I(),".session-roots",`${f}.json`)}function q$(h,f){try{let _=gc(h);Xn.mkdirSync(df.dirname(_),{recursive:!0}),Xn.writeFileSync(_,`${JSON.stringify(f)}
`,"utf8")}catch{}}function V$(h){try{let f=Xn.readFileSync(gc(h),"utf8"),_=JSON.parse(f),n=Array.isArray(_)?_:_?.roots;if(!Array.isArray(n))return;let c=n.filter((u)=>typeof u==="string"&&u.trim().length>0);if(!c.length)return;let y=(!Array.isArray(_)&&Array.isArray(_?.writeRoots)?_.writeRoots:c).filter((u)=>typeof u==="string"&&u.trim().length>0);return{roots:c,writeRoots:y,allowBash:Array.isArray(_)||_?.allowBash!==!1}}catch{return}}function M$(h){try{Xn.unlinkSync(gc(h))}catch{}}function Zb(h,f,_={}){if(!h)return;let n=f.filter((u)=>typeof u==="string"&&u.trim().length>0).map((u)=>wn(df.resolve(u))),c=(_.readOnlyRoots??[]).filter((u)=>typeof u==="string"&&u.trim().length>0).map((u)=>wn(df.resolve(u))),y={roots:[...new Set([...n,...c])],writeRoots:_.readOnly?[]:n,allowBash:_.allowBash!==!1};zn.set(h,y),q$(h,y)}function Pc(h){if(!h)return;zn.delete(h),M$(h)}function E$(h){let f=zn.get(h);if(f?.roots.length)return f;let _=V$(h);if(_?.roots.length)return zn.set(h,_),_;return}function R$(h,f){if(!h||!f.length)return!1;return f.some((_)=>C$(h,_))}function S$(h){let f=h.metadata;if(f)for(let n of["filepath","path","filePath","parentDir"]){let c=f[n];if(typeof c==="string"&&c.trim())return c.trim()}let _=h.patterns;if(Array.isArray(_))for(let n of _){if(typeof n!=="string"||!n.trim())continue;let c=n.replace(/\/\*\*$/,"").replace(/\/\*$/,"").replace(/\*$/,"");if(c.trim())return c.trim()}return}var D$=new Set(["read","grep","glob","list","write","edit","apply_patch","external_directory","external_directory_write","external_directory_read","dotfile"]),L$=new Set(["write","edit","apply_patch","external_directory_write","dotfile"]),m$=new Set(["blacklisted_bash","sandbox_risk_command"]),N$=new Set(kc);function BJ(h,f){let _=h.sessionID;if(!_)return;let n=E$(_);if(!n?.roots.length)return;let c=h.permission;if(!c){f.status="deny";return}if(c==="bash"){f.status=n.allowBash?"allow":"deny";return}if(m$.has(c)){f.status="deny";return}if(N$.has(c)){f.status="allow";return}if(!D$.has(c)){f.status="deny";return}let b=S$(h);if(!b){f.status="deny";return}let y=L$.has(c)?n.writeRoots:n.roots;f.status=R$(b,y)?"allow":"deny"}var F$=60000,Xb=3600000,I$=1e4,k$=3000,g$=1000,P$=5,l$=3,p$=30000,e$=5000;function vb(){let h=process.env.EVOLVE_WATCHDOG_VERBOSE?.trim();if(h==="1"||h?.toLowerCase()==="true")return!0;if(h==="0"||h?.toLowerCase()==="false")return!1;return process.env.EVOLVE_LOG_LEVEL?.toUpperCase()==="DEBUG"}function r$(h){let f=Number(process.env.EVOLVE_WATCHDOG_POLL_INTERVAL_MS);if(Number.isFinite(f)&&f>0)return f;if(vb())return Math.max(h,e$);return p$}function Lf(h){return h}function Y_(h){let f=h?.data;if(!Array.isArray(f))return[];return f.filter((_)=>_!=null)}function a$(h){let f=h instanceof Error?h.message:String(h??"");return/\b(path|sessionID|argument|input)\b.*\b(required|expected|invalid|missing)\b/i.test(f)||/\b(required|expected|invalid|missing)\b.*\b(path|sessionID|argument|input)\b/i.test(f)}async function J_(h,f,_={}){if(typeof h.session.messages!=="function")throw Error("session.messages is not available");let n=h.session.messages.bind(h.session),c=_.targetShape==="plugin",b=c?{path:{id:f}}:{sessionID:f},y=c?{sessionID:f}:{path:{id:f}};try{return await n(b,{throwOnError:!0,signal:_.signal})}catch(u){if(!a$(u))throw u;return await n(y,{throwOnError:!0,signal:_.signal})}}var i$=new Set(["busy","retry"]);function t$(h){return h!=null&&i$.has(h)}function lc(h){return h==null||h==="unknown"||h==="missing"}function vn(h){let f=[];for(let _ of h){if(_.info?.role!=="assistant")continue;for(let n of _.parts??[])if(n.type==="text"&&n.text)f.push(n.text)}return f.join(`
`)}function o$(h){for(let f=h.length-1;f>=0;f--){let _=h[f];if(!_)continue;if(_.info?.role==="assistant")return _.info.time?.completed!=null}return!1}function s$(h){return h.filter((f)=>f.info?.role==="assistant"&&f.info.time?.completed!=null)}function ec(h){let f=h.info?.id??h.id;return typeof f==="string"&&f.length>0?f:void 0}function h2(h){let f=h.filter((_)=>_.info?.role==="assistant");return{assistantMessageIds:new Set(f.map(ec).filter((_)=>_!=null)),assistantCount:f.length}}function zb(h,f){if(!f)return o$(h);let _=s$(h);if(_.some((c)=>{let b=ec(c);return b!=null&&!f.assistantMessageIds.has(b)}))return!0;return h.filter((c)=>c.info?.role==="assistant").length>f.assistantCount&&_.some((c)=>ec(c)==null)}async function f2(h,f,_){return(await h.session.status({},{signal:_})).data?.[f]?.type}async function _2(h,f,_={}){let n=_.pollIntervalMs??k$,c=r$(n),b=vb(),y=_.initialDelayMs??g$,u=_.maxPollErrors??P$,U=_.statusSettledMaxPolls??l$,$=_.pollTimeoutMs!=null?Date.now()+Math.max(0,_.pollTimeoutMs):Number.POSITIVE_INFINITY,j=_.signal,J=Date.now(),K=J,G=0,Z,z=0,W=0,w=0,v=(X,Q,d)=>{if(w++,w<U)return;throw e(`prompt_async_status_settled_incomplete stage=${_.stage??""} question=${_.questionId??""} role=${_.role??""} sessionId=${f} status=${X??"missing"} polls=${z} incompletePolls=${w}/${U} elapsed=${Q}s source=${d} result=failure`,_.logContext,"WARN"),new jh("incomplete_idle",`Session ${f} settled without a verified assistant completion after ${w} polls`)};await Hn(y,j);while(Date.now()<$&&!j?.aborted){z++;let X=Math.round((Date.now()-J)/1000);try{let Q=await f2(h,f,j),d=!1,B="",N={signal:j,targetShape:_.targetShape},A=Q!=null&&!t$(Q)&&!lc(Q);if(!A)w=0;if(A&&typeof h.session.messages==="function")try{let O=await J_(h,f,N),q=Y_(O);if(d=zb(q,_.assistantCompletionBaseline),d)w=0,B=vn(q);else v(Q,X,"completion_marker_missing")}catch(O){if(O instanceof jh)throw O;e(`prompt_async_messages_read_error stage=${_.stage??""} question=${_.questionId??""} role=${_.role??""} sessionId=${f} status=${Q??"missing"} polls=${z} elapsed=${X}s`,_.logContext,"WARN"),v(Q,X,"messages_read_error")}else if(A)v(Q,X,"messages_api_missing");let S=A&&d||lc(Q)&&d,E=Q!==Z;if(Date.now()-K>=c||E){let O=b||z<=1||E?"INFO":"DEBUG";e(`prompt_async_poll stage=${_.stage??""} question=${_.questionId??""} role=${_.role??""} sessionId=${f} status=${Q??"missing"} elapsed=${X}s polls=${z} chars=${B.length} assistantCompleted=${d}`,_.logContext,O),K=Date.now(),Z=Q}if(S){if(!B&&typeof h.session.messages==="function")try{let O=await J_(h,f,N),q=Y_(O);B=vn(q)}catch{B=""}return e(`prompt_async_complete stage=${_.stage??""} question=${_.questionId??""} role=${_.role??""} sessionId=${f} status=${Q??"missing"} elapsed=${X}s polls=${z} chars=${B.length}`,_.logContext),B}let F;if(lc(Q)){if(typeof h.session.messages==="function"){let O=await J_(h,f,N);F=Y_(O),d=zb(F,_.assistantCompletionBaseline)}if(d)return B=F?vn(F):"",e(`prompt_async_complete stage=${_.stage??""} question=${_.questionId??""} role=${_.role??""} sessionId=${f} status=${Q??"missing"} elapsed=${X}s polls=${z} chars=${B.length}`,_.logContext),B}if(Date.now()-K>=c){let O=b?"INFO":"DEBUG";e(`prompt_async_poll stage=${_.stage??""} question=${_.questionId??""} role=${_.role??""} sessionId=${f} status=${Q??"missing"} elapsed=${X}s polls=${z} chars=${B.length} assistantCompleted=${d}`,_.logContext,O),K=Date.now()}W=0}catch(Q){if(Q instanceof jh)throw Q;if(Hb(Q)||j?.aborted)throw new jh("prompt_timeout",`Aborted while waiting for promptAsync session ${f} to complete`);if(W++,Date.now()-G>=c||W>=u)e(`prompt_async_poll_error sessionId=${f} consecutiveErrors=${W}/${u} errorType=${dn(Q)}`,_.logContext,"WARN"),G=Date.now();if(W>=u)throw new jh("prompt_error",`Too many consecutive poll errors while waiting for promptAsync session ${f}: ${c2(Q)}`)}await Hn(n,j)}if(j?.aborted)throw new jh("prompt_timeout",`Aborted while waiting for promptAsync session ${f} to complete`);throw new jh("prompt_timeout",`Timeout waiting for promptAsync session ${f} to complete`)}async function Hn(h,f){if(h<=0)return;if(f?.aborted)return;if(!f){await new Promise((_)=>setTimeout(_,h));return}await new Promise((_)=>{let n=setTimeout(()=>{f.removeEventListener("abort",c),_()},h),c=()=>{clearTimeout(n),_()};f.addEventListener("abort",c,{once:!0})})}async function mf(h,f){if(!f.length)return;for(let _ of f)e(`cleanup_session_skipped sessionId=${_} policy=retain_session`)}var n2=500,pc=3;async function th(h,f,_,n){if(typeof h.session.messages!=="function")return"";if(_?.aborted)throw new DOMException("Aborted","AbortError");let c="";for(let b=0;b<=pc;b++){if(_?.aborted)throw new DOMException("Aborted","AbortError");let y=await J_(h,f,{signal:_,targetShape:n});if(c=vn(Y_(y)),c.trim())break;if(b<pc)e(`collect_assistant_text_empty_retry sessionId=${f} attempt=${b+1}/${pc}`),await Hn(n2*2**b,_)}return c}function jf(h,f,_){return async(n,c)=>{let b;if(typeof h.session.messages==="function"){let U=await J_(h,n,{signal:c,targetShape:_?.targetShape});b=h2(Y_(U))}let y=await f(n,c),u={..._,assistantCompletionBaseline:b,signal:c};return await _2(h,n,u),y}}function Of(h,f){return{pollIntervalMs:h?.pollInterval,pollTimeoutMs:h?.pollTimeout,initialDelayMs:h?.initialDelay,...f}}function c2(h){if(h instanceof Error)return h.message;if(typeof h==="string")return h;try{return JSON.stringify(h)}catch{return String(h)}}function dn(h){if(h instanceof jh)return`${rc(h)}:${h.reason}`;if(h instanceof Error)return rc(h);return typeof h}function rc(h){if(!(h instanceof Error))return typeof h;return/^[A-Za-z][A-Za-z0-9_.-]{0,63}$/.test(h.name)?h.name:"Error"}function y2(h){return h==="create"?"create_timeout":"prompt_timeout"}function b2(h){return h==="create"?"create_error":"prompt_error"}async function wb(h,f,_,n){let c;try{return await Promise.race([h,new Promise((b,y)=>{c=setTimeout(()=>{n?.abort(),y(new jh(y2(_),`${_} timed out after ${f}ms`))},f)})])}finally{if(c)clearTimeout(c)}}async function Qb(h,f){let _,n=Promise.resolve().then(h);try{return await Promise.race([n.then(()=>({result:"success"}),(c)=>({result:"failed",error:c})),new Promise((c)=>{_=setTimeout(()=>c({result:"timeout"}),f)})])}finally{if(_)clearTimeout(_)}}class jh extends Error{reason;constructor(h,f){super(f);this.reason=h;this.name="SessionWatchdogError"}}function u2(h,f){if(f instanceof jh)return f.reason;return b2(h)}function Qn(h,f){return`${h}/${f}`}function e(h,f,_="INFO"){if(!f)return;Y(`[session-watchdog] ${h}`,f)}function $2(h){return(typeof h==="string"?h:h?.requestLogFilePath)?.trim()||void 0}var U2={stalled:"stalled",hard_timeout:"prompt_timeout",session_lost:"session_lost",session_error:"prompt_error",probe_error:"heartbeat_probe_error"};function j2(h){return U2[h]??"prompt_error"}async function ac(h,f,_,n){let c=h.abortSession??h.killSession;if(!c)e(`session_abort_result stage=${h.stage} sessionId=${f} reason=${_} result=not_configured`,h.logContext);else{let u=Date.now(),U=await Qb(()=>c(f),n);if(U.result==="success")e(`session_abort_result stage=${h.stage} sessionId=${f} reason=${_} result=success elapsedMs=${Date.now()-u}`,h.logContext);else if(U.result==="failed")e(`session_abort_result stage=${h.stage} sessionId=${f} reason=${_} result=failed errorType=${dn(U.error)} elapsedMs=${Date.now()-u}`,h.logContext);else e(`session_abort_result stage=${h.stage} sessionId=${f} reason=${_} result=timeout timeoutMs=${n} elapsedMs=${Date.now()-u}`,h.logContext)}if(Pc(f),!h.deleteSession){e(`session_delete_result stage=${h.stage} sessionId=${f} reason=${_} result=not_configured`,h.logContext);return}let b=Date.now(),y=await Qb(()=>h.deleteSession(f),n);if(y.result==="success")e(`session_delete_result stage=${h.stage} sessionId=${f} reason=${_} result=success elapsedMs=${Date.now()-b}`,h.logContext);else if(y.result==="failed")e(`session_delete_result stage=${h.stage} sessionId=${f} reason=${_} result=failed errorType=${dn(y.error)} elapsedMs=${Date.now()-b}`,h.logContext);else e(`session_delete_result stage=${h.stage} sessionId=${f} reason=${_} result=timeout timeoutMs=${n} elapsedMs=${Date.now()-b}`,h.logContext)}function Y2(h,f,_,n){f.then(async(c)=>{if(!c?.trim())return;e(`late_create_cleanup stage=${h.stage} attempt=${_} sessionId=${c} result=start`,h.logContext),await ac(h,c,"create_timeout",n),e(`late_create_cleanup stage=${h.stage} attempt=${_} sessionId=${c} result=complete`,h.logContext)}).catch(()=>{})}function J2(h={}){return{name:h.name??"single_attempt",maxAttemptsLabel:"1",decide:()=>"fail",nextDelayMs:()=>h.delayMs??0}}function Ih(h){let f=Math.max(1,Math.floor(h.maxAttempts)),_=h.exhaustedDecision??"fail";return{name:h.name??`max_attempts_${f}`,maxAttemptsLabel:String(f),decide:({attempt:n})=>n<f?"retry":_,nextDelayMs:()=>h.delayMs??0}}function Hb(h){return h instanceof DOMException&&h.name==="AbortError"||h instanceof Error&&h.name==="AbortError"}function K2(h,f){if(!f)return()=>{};if(f.aborted)return h.abort(),()=>{};let _=()=>h.abort();return f.addEventListener("abort",_,{once:!0}),()=>f.removeEventListener("abort",_)}async function Mh(h){let f=Date.now(),_=h.createTimeoutMs??F$,n=Math.min(h.promptTimeoutMs??Xb,Xb),c=h.sessionCleanupTimeoutMs??I$;if(!Number.isFinite(c)||c<=0)throw Error("sessionCleanupTimeoutMs must be a finite positive number");let b=typeof h.heartbeat==="object"?h.heartbeat:void 0,y=$2(h.logContext);if(b&&!y)throw Error("requestLogFilePath is required when session heartbeat monitoring is enabled");let u=0;while(!0){u++;let U=Date.now();e(`attempt_start stage=${h.stage} operation=session question=${h.questionId??""} role=${h.role??""} attempt=${Qn(u,h.policy.maxAttemptsLabel)} policy=${h.policy.name} createTimeoutMs=${_} promptTimeoutMs=${n}`,h.logContext);let $,j,J,K=!1,G="stopped",Z,z=new AbortController,W=K2(z,h.signal);try{if(h.signal?.aborted)throw new DOMException("Aborted","AbortError");let w=Date.now();if(Z=Promise.resolve().then(h.createSession),$=await wb(Z,_,"create"),!$?.trim())throw new jh("invalid_session_response","session.create returned an empty session id");if(e(`session_created stage=${h.stage} attempt=${Qn(u,h.policy.maxAttemptsLabel)} sessionId=${$} elapsedMs=${Date.now()-w}`,h.logContext),b&&y){let N=b.thresholds?.hardTimeoutMs??n;j=new Cc({sessionID:$,requestLogFilePath:y,probe:b.probe?()=>b.probe($):void 0,progressContext:{stage:h.stage,questionId:h.questionId,role:h.role},thresholds:{...b.thresholds,hardTimeoutMs:Math.min(N,n)},now:b.now,setInterval:b.setInterval,clearInterval:b.clearInterval});let A=b.registry??Sf;j.start(),J=A.register(j)}let v=Date.now(),X=Promise.resolve().then(()=>h.runPrompt($,z.signal)),Q=j?.waitForFailure().then((N)=>{throw K=!0,new jh(j2(N.reason),`Session heartbeat terminated: ${N.reason}`)}),d=await wb(Q?Promise.race([X,Q]):X,n,"prompt",z);G="success";let B=Date.now()-f;return e(`prompt_success stage=${h.stage} question=${h.questionId??""} role=${h.role??""} attempt=${Qn(u,h.policy.maxAttemptsLabel)} sessionId=${$} elapsedMs=${Date.now()-v} result=success`,h.logContext),e(`session_stage_final stage=${h.stage} question=${h.questionId??""} role=${h.role??""} finalStatus=success sessionId=${$} attempts=${u} elapsedMs=${B}`,h.logContext),Zn({stage:h.stage,questionId:h.questionId,role:h.role,sessionId:$,elapsedMs:B,ok:!0,attempts:u}),Pc($),{ok:!0,sessionId:$,value:d,attempts:u,elapsedMs:B}}catch(w){if(z.abort(),h.signal?.aborted){if(G="aborted",j?.stop(G),J?.(),j=void 0,J=void 0,$)await ac(h,$,"prompt_error",c);throw Hb(w)?w:new DOMException("Aborted","AbortError")}let v;if(w instanceof jh&&w.reason.startsWith("create"))v="create";else if($)v="prompt";else v="create";let X=u2(v,w);if(G=X,j?.stop(G),J?.(),j=void 0,J=void 0,X==="create_timeout"&&Z)Y2(h,Z,u,c);let Q=Date.now()-f,d={stage:h.stage,operation:v,attempt:u,elapsedMs:Q,reason:X,error:w,sessionId:$};if($&&!K)e(`termination_triggered stage=${h.stage} sessionId=${$} reason=${X} attempt=${u}`,h.logContext);e(`failure stage=${h.stage} operation=${v} question=${h.questionId??""} role=${h.role??""} attempt=${Qn(u,h.policy.maxAttemptsLabel)} sessionId=${$??""} reason=${X} errorType=${dn(w)} elapsedMs=${Date.now()-U}`,h.logContext);let B=Fc(X);if(B)Lc({kind:B,reason:X,stage:h.stage,questionId:h.questionId,role:h.role,sessionId:$,attempt:u});else mc({reason:X,stage:h.stage,questionId:h.questionId,role:h.role,sessionId:$,attempt:u});if($)await ac(h,$,X,c);let N=h.policy.decide(d);if(e(`retry_decision stage=${h.stage} operation=${v} attempt=${u} policy=${h.policy.name} decision=${N} reason=${X}`,h.logContext),N!=="retry"){let S=N==="skip"?"skipped":"failed";return e(`session_stage_final stage=${h.stage} question=${h.questionId??""} role=${h.role??""} finalStatus=${S} attempts=${u} elapsedMs=${Q} reason=${X} sessionId=${$??""}`,h.logContext),Zn({stage:h.stage,questionId:h.questionId,role:h.role,sessionId:$,elapsedMs:Q,ok:!1,attempts:u}),{ok:!1,status:S,attempts:u,elapsedMs:Q,reason:X,errorMessage:`${X}:${rc(w)}`,sessionId:$}}let A=h.policy.nextDelayMs?.(d)??0;e(`retry stage=${h.stage} attempt=${u} nextAttempt=${u+1} maxAttempts=${h.policy.maxAttemptsLabel} policy=${h.policy.name} decision=retry delayMs=${A} reason=${X}`,h.logContext),await Hn(A)}finally{W(),j?.stop(G),J?.()}}}function db(h,f="session.create"){let _=String(h?.data?.id??"").trim();if(!_)throw new jh("invalid_session_response",`${f} returned an empty session id`);return _}async function ic(h){let f=h.requestLogFilePath.trim();if(!f)throw Error("requestLogFilePath is required when session heartbeat monitoring is enabled");let _=Lf(h.client),n=jf(_,h.invokePromptAsync,{stage:h.stage,logContext:f,questionId:h.questionId,role:h.role,targetShape:h.targetShape});return Mh({...dh(h.client,{targetShape:h.targetShape}),stage:h.stage,questionId:h.questionId,role:h.role,policy:h.policy??J2({name:`${h.stage}_once`}),createSession:h.createSession,runPrompt:async(c,b)=>{return await n(c,b),th(_,c,b,h.targetShape)},logContext:f,signal:h.signal})}import Nf from"path";function Xh(h){let f=h.worktree?.trim()||I();return{parentID:"ses_silent",permission:Wb({allowedRoots:h.allowedRoots,readOnlyRoots:h.readOnlyRoots,worktree:f,allowBash:h.allowBash,readOnly:h.readOnly})}}function G2(h,f,_={}){let n=String(h??"").trim();if(!n)throw Error("evolve silent session create returned an empty session id");return Zb(n,f,_),n}function zh(h,f,_={}){return G2(db(h),f,_)}function Tb(){return[Ob()]}function tc(h,f){return[K_("user",{projectDir:h,homeDir:f})]}function xb(h,f){let _=Nf.resolve(h);return[_,...tc(_,f)]}function Cb(h){return[nh(h)]}function NJ(h){return[Nf.resolve(h)]}function oc(h){return[Nf.resolve(h)]}function qb(h,f){return[Bb(h,f),nh(h),Nf.join(I(),"history",h)]}function FJ(h){let f=[Ab()],_=h?.trim();if(!_)return f;return f.push(K_("project",{projectDir:_})),f}function IJ(h){let f=h?.trim();return f?[Nf.resolve(f)]:[]}function Vb(h){return[nh(h),Nf.join(I(),"history",h)]}import Eb from"fs";import Bn from"path";var W2=["L0.frontmatter","L0.bundled_paths","L0.primary_action","L0.output_contract","L0.package_layout","L0.description_trigger_quality","L0.resource_index","L0.config_contract","L0.state_storage_contract","L0.hook_declaration","L0.config_schema","L0.state_contract","L1.intention_drift","L1.cross_reference","L1.shape_baking","L1.param_axis_freeze","L1.scope_creep","L1.cross_reference.semantic","L1.intention_drift.semantic","L1.method_vs_answer","L1.scope_creep.semantic","L1.trace_unbacked.semantic","L2.negative_constraints","L2.verification_binding","L2.progressive_disclosure","L2.gotchas_presence","L2.gotcha_specificity","L2.hard_assertion_density","L2.failure_branch_hint","L2.gotcha_specificity.semantic","L2.over_railroading","L2.verification_programmatic","L2.failure_branch.semantic","L3.silent_bypass","L3.trigger_precision","L3.attention_budget","L3.silent_bypass.semantic","L3.behavioral_delta.semantic","L3.gotcha_consumption"];var Z2=[{ruleId:"L0.primary_action",level:"L0",check:"\u6280\u80FD\u662F\u5426\u5199\u660E\u53EF\u6267\u884C\u7684\u7B2C\u4E00\u6B65\uFF08Workflow/\u5DE5\u4F5C\u6D41/\u6B65\u9AA4\u3001\u4E3B\u811A\u672C\u6216\u7B49\u4EF7\u4E2D\u82F1\u6587\u6307\u5F15\uFF09",tier:"base"},{ruleId:"L0.output_contract",level:"L0",check:"\u662F\u5426\u5B9A\u4E49\u5B8C\u6210\u6807\u51C6\u6216\u9A8C\u8BC1\u65B9\u6CD5\uFF08Verification/\u9A8C\u8BC1\u3001deliverable\u3001\u52FE\u9009\u6E05\u5355\u7B49\uFF09",tier:"base"},{ruleId:"L0.description_trigger_quality",level:"L0",check:"description \u662F\u5426\u542B\u6E05\u6670\u89E6\u53D1\u573A\u666F\u4E0E\u8D1F\u9762\u8FB9\u754C\uFF08\u4E2D\u82F1\u5747\u53EF\uFF09",tier:"base"},{ruleId:"L0.package_layout",level:"L0",check:"\u5927\u4F53\u91CF\u6280\u80FD\u662F\u5426\u5E94\u62C6\u5206 references/examples/scripts\uFF08\u8FC7\u957F\u4E14 bundled \u8F83\u591A\u65F6\uFF09",tier:"base"},{ruleId:"L1.scope_creep.semantic",level:"L1",check:"\u6B63\u6587\u662F\u5426\u585E\u8FDB\u591A\u5957\u65E0\u5173\u6D41\u7A0B\uFF0C\u662F\u5426\u5E94\u6536\u655B\u6216\u62C6 references",tier:"base"},{ruleId:"L2.negative_constraints",level:"L2",check:"\u662F\u5426\u5199\u660E\u7981\u6B62/\u8D1F\u5411\u7EA6\u675F\uFF08do not\u3001never\u3001\u7981\u6B62\u3001\u4E0D\u80FD\u7B49\uFF0C\u4E2D\u82F1\u6587\u5747\u53EF\uFF09",tier:"base"},{ruleId:"L2.verification_binding",level:"L2",check:"\u591A\u6B65\u6D41\u7A0B\u662F\u5426\u914D\u6709\u53EF\u64CD\u4F5C\u7684\u9A8C\u8BC1\u6BB5\uFF08Verification/\u9A8C\u8BC1\u65B9\u6CD5/\u81EA\u68C0\u6B65\u9AA4\uFF09",tier:"base"},{ruleId:"L2.gotchas_presence",level:"L2",check:"\u590D\u6742\u6280\u80FD\uFF08\u7EA6 80+ \u884C\uFF09\u662F\u5426\u63D0\u4F9B Gotchas/\u8E29\u5751\u63D0\u793A\u6BB5",tier:"base"},{ruleId:"L2.gotcha_specificity",level:"L2",check:"Gotchas \u6BB5\u662F\u5426\u5177\u4F53\u53EF\u6267\u884C\uFF08\u6709\u6BB5\u4F46\u8FC7\u77ED\u6216\u7A7A\u8BDD\u4E5F\u5E94 fail\uFF09",tier:"base"},{ruleId:"L2.failure_branch_hint",level:"L2",check:"\u63D0\u5230\u5931\u8D25/\u9519\u8BEF/\u8D85\u65F6\u8DEF\u5F84\u65F6\u662F\u5426\u7ED9\u51FA\u6062\u590D\u6216 fallback \u6307\u5F15",tier:"base"}],X2={ruleId:"L1.cross_reference.semantic",level:"L1",check:"\u6280\u80FD\u6B63\u6587\u662F\u5426\u8BED\u4E49\u7EA7\u6CC4\u6F0F\u8BC4\u6D4B\u9898\u96C6\uFF08\u542B\u9898\u96C6\u4E13\u6709\u672F\u8BED/\u9AD8\u9891\u4E1A\u52A1\u8BCD\u6E17\u5165\u6982\u8FF0\uFF09",tier:"base"},z2={ruleId:"L1.intention_drift.semantic",level:"L1",check:"\u6280\u80FD\u4E3B\u9898\u662F\u5426\u504F\u79BB\u7528\u6237\u8FDB\u5316\u610F\u56FE",tier:"base"};function w2(h){let f=[];if(h.corpus.intention.trim())f.push(z2);if(h.corpus.prompts.length>=1)f.push(X2);return f}var Q2={ruleId:"L1.method_vs_answer",level:"L1",check:"scripts \u5E94\u662F\u6821\u9A8C/\u80F6\u6C34\u5C42\uFF0C\u6838\u5FC3\u6C42\u89E3\u903B\u8F91\u4E0D\u5E94\u6574\u5305\u585E\u8FDB\u811A\u672C",tier:"base"},v2=[{ruleId:"L3.silent_bypass.semantic",level:"L3",check:"\u662F\u5426\u540D\u4E49\u6309\u6280\u80FD\u6267\u884C\u3001\u5B9E\u9645\u7ED5\u8FC7\u58F0\u660E\u811A\u672C",tier:"base"},{ruleId:"L3.behavioral_delta.semantic",level:"L3",check:"\u5B9E\u9A8C\u7EC4\u884C\u4E3A\u53D8\u5316\u662F\u5426\u4E0E\u6280\u80FD\u6539\u52A8\u4E00\u81F4",tier:"base"}],H2=5;var d2=40,O2={"L1.method_vs_answer":{ruleId:"L1.method_vs_answer",level:"L1",check:"\u6280\u80FD\u6559\u65B9\u6CD5\u800C\u975E\u628A\u6C42\u89E3\u903B\u8F91/\u7B54\u6848\u5199\u8FDB\u5305\u5185\uFF08\u9759\u6001\u5DF2\u53D1\u73B0\u811A\u672C\u6216\u5F62\u72B6\u70D8\u7119\u4FE1\u53F7\uFF09",tier:"escalation"},"L2.over_railroading":{ruleId:"L2.over_railroading",level:"L2",check:"MUST/NEVER/ALWAYS \u5BC6\u5EA6\u8FC7\u9AD8\u65F6\uFF0C\u63AA\u8F9E\u662F\u5426\u8FC7\u5EA6\u7EA6\u675F Agent\uFF08\u6D4B\u524D\u6587\u6863\u8D28\u91CF\uFF09",tier:"escalation"},"L1.trace_unbacked.semantic":{ruleId:"L1.trace_unbacked.semantic",level:"L1",check:"\u5F3A\u786C\u65AD\u8A00\u662F\u5426\u5728\u673A\u5236\u5206\u6790\u6216\u8F68\u8FF9\u4E2D\u6709\u4F9D\u636E\uFF08\u6D4B\u540E\uFF1B\u4E0E over_railroading \u4E92\u65A5\uFF09",tier:"escalation"},"L2.gotcha_specificity.semantic":{ruleId:"L2.gotcha_specificity.semantic",level:"L2",check:"Gotchas \u6BB5\u843D\u662F\u5426\u5177\u4F53\u3001\u53EF\u6267\u884C\uFF08\u9759\u6001\u5DF2\u786E\u8BA4\u6709\u6BB5\u843D\u4E14\u957F\u5EA6\u8FBE\u6807\uFF09",tier:"escalation"},"L3.gotcha_consumption":{ruleId:"L3.gotcha_consumption",level:"L3",check:"Agent \u6267\u884C\u4E2D\u662F\u5426\u5FFD\u89C6\u6280\u80FD\u5DF2\u58F0\u660E\u7684\u8E29\u5751\u63D0\u793A",tier:"escalation"}};function Mb(h,f){return h.some((_)=>_.ruleId===f&&!_.passed)}function B2(h){return h.match(/\b(MUST|NEVER|ALWAYS)\b/gi)?.length??0}function sc(h,f,_){for(let n of _){if(f.has(n.ruleId))continue;f.add(n.ruleId),h.push(n)}}function gJ(h){let f=[],_=new Set;if(h.phase==="pre-ab")sc(f,_,Z2),sc(f,_,w2(h.input));else sc(f,_,v2);if(h.phase==="pre-ab"&&(h.input.directories.scripts||h.input.scriptContents.size>0)&&!_.has("L1.method_vs_answer"))_.add("L1.method_vs_answer"),f.push(Q2);function n(u){let U=O2[u];if(!U||_.has(U.ruleId))return;_.add(U.ruleId),f.push(U)}let c=B2(h.input.skillMdContent),b=h.input.gotchasSection?.trim()??"";if(c>H2||Mb(h.staticFindings,"L2.hard_assertion_density")){if(h.phase==="post-ab"&&h.hasMechanismAnalysis)n("L1.trace_unbacked.semantic");else if(h.phase==="pre-ab")n("L2.over_railroading")}if(b.length>=d2){if(n("L2.gotcha_specificity.semantic"),h.phase==="post-ab")n("L3.gotcha_consumption")}if(Mb(h.staticFindings,"L1.shape_baking"))n("L1.method_vs_answer");return f}function PJ(h){if(h.startsWith("L0."))return"L0";if(h.startsWith("L1."))return"L1";if(h.startsWith("L2."))return"L2";if(h.startsWith("L3."))return"L3";return"L1"}var On={enabled:!0,preAbMaxFixRounds:3,preReviewerEnabled:!0,postReviewerEnabled:!0};var A2=An.create({service:"skill-evolver"});function W_(h){let f={...On},_=h?.trim()||Bn.join(G_(),"skillEvolveConfig.json");_=Bn.resolve(_);let n=Bn.resolve(G_());if(!_.startsWith(n+Bn.sep)&&_!==n)return f;let c=process.env.EVOLVE_V3_SKILL_LENS_ENABLED?.trim().toLowerCase();if(c==="false"||c==="0")f.enabled=!1;else if(c==="true"||c==="1")f.enabled=!0;try{if(!Eb.existsSync(_))return f;let b=JSON.parse(Eb.readFileSync(_,"utf-8"));if(typeof b.evolve_v3_skill_lens_enabled==="boolean")f.enabled=b.evolve_v3_skill_lens_enabled;if(typeof b.evolve_v3_skill_lens_pre_ab_max_rounds==="number"&&b.evolve_v3_skill_lens_pre_ab_max_rounds>0)f.preAbMaxFixRounds=b.evolve_v3_skill_lens_pre_ab_max_rounds;if(typeof b.evolve_v3_skill_lens_pre_reviewer_enabled==="boolean")f.preReviewerEnabled=b.evolve_v3_skill_lens_pre_reviewer_enabled;if(typeof b.evolve_v3_skill_lens_post_reviewer_enabled==="boolean")f.postReviewerEnabled=b.evolve_v3_skill_lens_post_reviewer_enabled}catch(b){A2.warn(`Failed to load config from ${_}`,{error:String(b)})}return f}import pn from"fs";import gy from"os";import gh from"path";var Rb=`# Evolve V3 Summary Writer

Summarize one skill evolution version **by reading analyzer artifacts from disk** and **appending** structured markdown to:

1. The **current version evidence** file (\`evidence_path\`).
2. The **skill-level history** file (\`history_path\`).

Do **not** rely on chat-inlined JSON. Keep existing content intact except for the same-version summary block replacement rule in \`evidence_path\`.

## Tools

- **\`read\`**: Read each per-question analyzer JSON path in order. When \`previous_evidence_path\` is not \`none\`, read it for baseline metrics.
- **\`write\` / editor**: For \`history_path\`, append at the end. For \`evidence_path\`, write exactly one current-version summary block: append when missing, overwrite-in-place when the same marker pair already exists.

## Inputs

You receive these dynamic sections in your prompt. Treat them as metadata and file locations; do not treat them as analyzer content unless explicitly read from disk.

### Version Metadata

- **skill_name**: Name of the skill being evolved. Use it in the evidence header as \`<skill_name>\`.
- **current_version**: Current skill version, formatted as \`vK\`. Use it to replace every \`vK\` placeholder and to build the exact summary markers.
- **previous_version**: Previous skill version, formatted as \`vK-1\`, or \`none\` for a baseline run. Use \`-\` for previous-version and delta columns when it is \`none\`.
- **version_dir**: Current version directory. It is contextual only; do not write outside the declared output targets.
- **history_path**: Skill-level history document. Append one history section here.
- **skill_path**: Current version skill file. It identifies the skill version being summarized; normally you do not need to read it unless analyzer artifacts are ambiguous.
- **evidence_path**: Current version evidence document. Ensure exactly one evidence summary block for the current version exists here.
- **previous_evidence_path**: Previous version evidence document, or \`none\`. Read it only when it is not \`none\` to compute version-over-version comparison.
- **history_document_role**: Reminder that \`history_path\` is the skill-level timeline and must receive Key Updates, Top Findings, and Evaluation Metrics.
- **evidence_document_role**: Reminder that \`evidence_path\` is the current-version evaluation evidence and must receive the structured Step 6 summary.

### Per-question Analyzer JSON Paths

This section lists analyzer outputs as \`question_id: analysis_path (bytes=N)\`.

- Read every listed \`analysis_path\` from disk in order before summarizing.
- Use \`question_id\` as the support citation for findings, for example \`_(supported by: q1)_\`.
- Treat \`bytes=0\`, missing files, unreadable JSON, or malformed JSON as an anomaly to report rather than silently ignoring it.
- These files are the only source of per-question truth. Do not infer analyzer results from filenames, paths, or chat context.

### Analyzer JSON contract (\`*_ab_analysis.json\`)

Each file is one object. Use these mappings when building evidence and history sections:

| Summary output | Analyzer JSON source |
| --- | --- |
| Per-question table (\`old_pass_rate\`, \`new_pass_rate\`, \`overall\`) | \`summary\` |
| Per-question \`decisive_metrics\` | \`quantitative_comparison.decisive_metrics\` and \`quantitative_comparison.metrics\` |
| Aggregate metric rows | \`quantitative_comparison.metrics\` (aggregate across questions) |
| Patterns / anomalies | \`expectation_verdicts\`, \`trajectory_comparison.notable_differences\`, \`claims\` |
| Causal diagnosis \u2014 winner strengths | \`skill_mechanism_analysis.winner_success_mechanisms\`, \`instruction_following.winner\` |
| Causal diagnosis \u2014 loser weaknesses | \`skill_mechanism_analysis.loser_failure_mechanisms\`, \`instruction_following.loser\` |
| Consolidated Keep | \`skill_feedback.keep\` and cherry-pickable \`winner_success_mechanisms\` |
| Consolidated Improve | \`skill_feedback.improve\`, \`improvement_suggestions\` |
| Consolidated Regression risks | \`skill_feedback.regression_risks\`, \`summary.overall\` when \`regressed\` |
| Prioritized improvement table | \`improvement_suggestions\` and nested \`loser_failure_mechanisms[].improvement_suggestion\` |
| Comparator context (optional prose) | \`comparison_summary.comparator_reasoning\` |
| Execution patterns | \`transcript_insights\` |

Remember: \`old\` / \`new\` in bridge fields mean baseline (A) vs treatment (B), not winner vs loser.

### Output Targets

- **history_path**: Append exactly one history section using the history output format.
- **evidence_path**: Maintain exactly one evidence block for current version using the evidence output format (append if missing, overwrite if existing).
- **previous_evidence_path**: Read for baseline metrics and deltas when not \`none\`; never append to it.

### Dynamic Placeholder Rules

- Replace \`vK\` with the concrete \`current_version\`.
- Replace \`vK-1\` with the concrete \`previous_version\`, or \`-\` when there is no previous version.
- Replace \`<skill_name>\` with \`skill_name\`.
- Replace \`<previous_version or none>\` with \`previous_version\`.
- Use the exact marker pair provided by the dynamic prompt. If it already exists in \`evidence_path\`, overwrite that existing block with the newly generated content (do not report conflict, do not create duplicates).

## Evidence file (\`evidence_path\`)

Follow the **exact** evidence output format below (including \`<<<EVOLVE_V3_SUMMARY_BEGIN vK>>>\` ... \`<<<EVOLVE_V3_SUMMARY_END vK>>>\`). The dynamic prompt provides the concrete current version; replace every \`vK\` placeholder with that version. Include:

1. **Evaluation-set quantitative snapshot** \u2014 per-question table + aggregate metrics.
2. **Version-over-version comparison** \u2014 deltas vs previous evidence when available.
3. **Patterns and anomalies** \u2014 cross-question observations that aggregate metrics hide.
4. **Causal skill diagnosis** \u2014 explain which winner strengths, loser weaknesses, or execution differences most likely changed outcomes.
5. **Consolidated skill feedback** \u2014 merged Keep / Improve / Regression lists with \`_(supported by: q\u2026)_\` on every bullet.
6. **Prioritized improvement suggestions** \u2014 concrete next skill changes derived from trajectory-level evidence, especially tool-call patterns, avoidable writing errors, verification gaps, and efficiency opportunities.

## Analysis rules

- Be specific: ground every non-obvious conclusion in analyzer JSON fields and cite \`question_id\`.
- Separate causal findings from incidental observations. Do not present a one-question anomaly as a general skill flaw unless the evidence supports it.
- Prefer quantitative explanations first: pass-rate movement, decisive metrics, tool errors, tests, coverage, tokens, duration, or other analyzer-reported numbers.
- Do not merely restate aggregate metrics. Add interpretation only when it reveals a pattern, anomaly, regression risk, or actionable skill change.
- When analyzer JSON includes \`trajectory_comparison\`, \`instruction_following\`, \`skill_mechanism_analysis\`, \`claims\`, or \`improvement_suggestions\`, consolidate them instead of dropping them.
- Prioritized suggestions must be more concrete than "add tests" or "improve verification". Each row should name the triggering situation, the specific tool/action sequence or writing rule to add, and the observed evidence that supports it.
- Prefer suggestions that optimize future execution behavior: better tool-call ordering, narrower searches/reads, earlier compile/type checks, avoiding repeated failed commands, preventing common syntax/API/path/import mistakes, reducing unnecessary edits, or making final claims only after evidence exists.
- Use these categories for suggestions when possible: \`instructions\`, \`tools\`, \`verification\`, \`efficiency\`, \`error_handling\`, \`structure\`, \`examples\`, \`references\`.
- Use these priorities: \`high\` = likely to change outcomes, \`medium\` = improves quality but may not flip results, \`low\` = marginal or cleanup.

Guidance for Prioritized Improvement Suggestions rows:

- **Tool-call pattern rows** should say what to do first/next/last, not just which command exists. Example: "For Maven test-file tasks, inspect \`pom.xml\` and existing \`src/test\` conventions, then run \`mvn -q -DskipTests test-compile\` before full \`mvn test\`; avoid claiming success after file creation only."
- **Avoidable writing error rows** should name the error class and prevention rule. Example: "Before adding assertions, confirm imported assertion library and method signatures from existing tests to avoid compile-only failures caused by wrong APIs."
- **Efficiency rows** should identify wasted steps and a replacement pattern. Example: "When the first command output already names the failing file and line, read that file directly instead of broad repository searches; expected to reduce duplicate search/read calls."
- **Verification rows** should bind the check to the task outcome. Example: "For generated test code, require both compile verification and at least one task-relevant test run; compile catches syntax/import issues, the test run catches behavioral mismatches."
- If analyzer JSON lacks enough evidence for a concrete row, write \`none - analyzer evidence insufficient\` rather than inventing a generic suggestion.

If a summary block for the same version markers already exists, **replace that block in place** with the latest generated summary.

## Output formats

### Evidence append format (\`evidence_path\`)

\`\`\`md
<<<EVOLVE_V3_SUMMARY_BEGIN vK>>>

# Step 6: AB Test Summary (vK)

- generated_at: <ISO timestamp>
- skill: <skill_name>
- previous_version: <previous_version or none>
- analyzer_json_count: <N>

## 1. Evaluation-set Quantitative Snapshot

### 1.1 Per-question

| question_id | old_pass_rate | new_pass_rate | overall | decisive_metrics |
| --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... |

### 1.2 Aggregate (vK)

| metric | mean | median | coverage |
| --- | --- | --- | --- |
| expectations_pass_rate_new | ... | ... | N/N |
| expectations_pass_rate_old | ... | ... | N/N |
| tool_steps | ... | ... | N/N |
| tool_errors | ... | ... | N/N |
| tokens_total | ... | ... | N/N |
| duration_seconds | ... | ... | N/N |
| build_passed | ... | ... | N/N |
| tests_pass_rate | ... | ... | N/N |
| line_coverage | ... | ... | N/N |
| lint_errors | ... | ... | N/N |

> coverage: reported question count for that metric / total question count. Use \`unknown\` for missing values.

### 1.3 Patterns and Anomalies

- differentiating_expectations: ... _(supported by: q...)_
- non_differentiating_expectations: ... _(supported by: q...)_ or \`- none\`
- persistent_failures: ... _(supported by: q...)_ or \`- none\`
- metric_outliers: ... _(supported by: q..., metric=...)_ or \`- none\`

## 2. Version-over-Version Comparison

### 2.1 Aggregate Delta (vK-1 -> vK)

| metric | vK-1 | vK | delta | direction |
| --- | --- | --- | --- | --- |
| expectations_pass_rate | ... | ... | ... | improved \\| regressed \\| unchanged \\| unknown |
| tool_steps | ... | ... | ... | ... |
| tool_errors | ... | ... | ... | ... |
| tokens_total | ... | ... | ... | ... |
| build_passed | ... | ... | ... | ... |
| tests_pass_rate | ... | ... | ... | ... |
| line_coverage | ... | ... | ... | ... |

> If \`previous_evidence_path\` is \`none\`, write \`_baseline version - no comparison available_\` and omit the table.

### 2.2 Question-level Movement

- improved: ... (count=...)
- regressed: ... (count=...)
- unchanged: ... (count=...)
- unclear: ... (count=...)

### 2.3 Regression Risks

- ... or \`- none\`.

## 3. Causal Skill Diagnosis

### 3.1 Outcome Drivers

| finding | causal_or_incidental | evidence | supported_by |
| --- | --- | --- | --- |
| ... | causal \\| incidental \\| unclear | include numbers or analyzer evidence | q... |

### 3.2 Winner Strengths To Preserve

- ... _(supported by: q..., impact: ...)_

### 3.3 Loser Weaknesses To Address

- ... _(supported by: q..., impact: ...)_

## 4. Consolidated Skill Feedback

### 4.1 Keep

- ... _(supported by: q...)_

### 4.2 Improve

- ... _(supported by: q...)_

### 4.3 Regression Risks

- ... _(supported by: q...)_ or \`- none\`.

## 5. Prioritized Improvement Suggestions

| priority | category | suggestion | expected_impact | supported_by |
| --- | --- | --- | --- | --- |
| high \\| medium \\| low | instructions \\| tools \\| verification \\| efficiency \\| error_handling \\| structure \\| examples \\| references | concrete skill change with trigger + tool/action sequence + anti-pattern to avoid | expected outcome with observed evidence, preferably numeric | q... |

<<<EVOLVE_V3_SUMMARY_END vK>>>
\`\`\`

## History file (\`history_path\`)

Append one section per run:

- \`### Key Updates\` \u2014 at least two bullets; each bullet must include a number or \`question_id\`.
- \`### Top Findings\` \u2014 2-4 bullets summarizing causal wins/losses, anomalies, or high-priority next actions with supporting \`question_id\`.
- \`### Evaluation Metrics\` \u2014 fixed seven-row table comparing previous vs current (use \`-\` for baseline columns when no previous version).

### History append format (\`history_path\`)

\`\`\`md
## vK - <ISO timestamp>

### Key Updates
- <point with number or question_id>
- <point with number or question_id>

### Top Findings
- <causal finding, anomaly, or high-priority suggestion with question_id or number>
- <causal finding, anomaly, or high-priority suggestion with question_id or number>

### Evaluation Metrics

| Metric | vK-1 | vK | Delta | Notes |
| --- | --- | --- | --- | --- |
| expectations_pass_rate | ... | ... | ... | ... |
| tool_steps_avg | ... | ... | ... | ... |
| tool_errors_avg | ... | ... | ... | ... |
| tokens_total_avg | ... | ... | ... | ... |
| build_passed_rate | ... | ... | ... | ... |
| tests_pass_rate | ... | ... | ... | ... |
| line_coverage_avg | ... | ... | ... | ... |
\`\`\`

## Chat output

After successful appends, reply with **at most one short confirmation line**. Do **not** return JSON.`;var Tn="OPENCODE_EVOLVE_PROJECT_DIR",Z_="grader",xn="expectations-generator",X_="evolve-v3-ab-analyzer",Cn="evolve-v3-ab-session";var _8="evolve-v3-skill-lens-reviewer";import Mn from"fs";import gf from"path";function hy(h){if(h===null||h===void 0)return;if(typeof h==="boolean")return h?1:0;if(typeof h==="number"&&Number.isFinite(h))return h;return}function fy(h,f){return h?.find((_)=>_.metric===f&&_.unavailable!==!0)}function _y(h,f){let _=[];for(let n of h){let c=fy(n.extEvalResults,f);if(!c)continue;let b=hy(c.value);if(b!==void 0)_.push(b)}if(_.length===0)return;return _.reduce((n,c)=>n+c,0)/_.length}function T2(h){return[...h].sort((f,_)=>{if(_.priority!==f.priority)return _.priority-f.priority;return f.metric.localeCompare(_.metric)})}function Sb(h,f,_){let n=[];for(let c of _??[]){let b=fy(h.extEvalResults,c.metric),y=fy(f.extEvalResults,c.metric);n.push({kind:"ext_eval",metric:c.metric,priority:c.priority,baselineScore:b?hy(b.value):void 0,treatmentScore:y?hy(y.value):void 0})}return n.push({kind:"pass_rate",metric:"__pass_rate__",priority:50,baselineScore:h.expectationsPassRate,treatmentScore:f.expectationsPassRate}),n}function z_(h){let f=[];for(let _ of h.extEval??[])f.push({kind:"ext_eval",metric:_.metric,priority:_.priority,baselineScore:h.baselineSides?.length?_y(h.baselineSides,_.metric):void 0,treatmentScore:h.treatmentSides?.length?_y(h.treatmentSides,_.metric):void 0});return f.push({kind:"pass_rate",metric:"__pass_rate__",priority:50,baselineScore:h.baselinePassRate,treatmentScore:h.treatmentPassRate}),f}function Db(h,f){if(h===void 0&&f===void 0)return"skip";if(h===void 0)return"treatment";if(f===void 0)return"baseline";if(h-f>0.000000001)return"baseline";if(f-h>0.000000001)return"treatment";return"tie"}function x2(h){return h.kind==="pass_rate"?"expectations_pass_rate":h.metric}function Ff(h,f){if(f===void 0)return"n/a";if(h.kind==="pass_rate")return`${(f*100).toFixed(2)}%`;return Number.isFinite(f)?String(f):"n/a"}function C2(h){switch(h){case"baseline":return"baseline wins";case"treatment":return"treatment wins";case"tie":return"tie";case"skip":return"skip (no score on either side)";default:return`unknown outcome: ${h}`}}function If(h){let f=[],_=null;for(let n of T2(h)){let c=Db(n.baselineScore,n.treatmentScore);if(f.push({lane:n,outcome:c}),!_&&c!=="skip"&&c!=="tie")_={winner:c,decisionBasis:n.kind==="pass_rate"?"pass_rate":"ext_eval",decisionMetric:n.kind==="ext_eval"?n.metric:void 0}}return{evaluations:f,decision:_}}function ny(h){let f=["[evolve-v3][comparator] Performance metrics (computed for all lanes, compared by priority high\u2192low):"];return h.forEach((_,n)=>{let{lane:c,outcome:b}=_,y=x2(c),u=b==="baseline"||b==="treatment";f.push(`[evolve-v3][comparator]   [${n+1}] metric=${y} priority=${c.priority} baseline=${Ff(c,c.baselineScore)} treatment=${Ff(c,c.treatmentScore)} `+`\u2192 ${C2(b)}${u?" (decisive)":""}`)}),f}function qn(h){let f;if(h.winner==="baseline")f="baseline (side A)";else if(h.winner==="treatment")f="treatment (side B)";else f="none";if(h.winner==="tie")return"[evolve-v3][comparator] Final verdict: tie. Reason: no decisive difference on any performance metric, and efficiency metrics (tokens / duration / cost) are also equal.";let _=h.performanceEvaluations.find((b)=>(b.outcome==="baseline"||b.outcome==="treatment")&&b.outcome===h.winner&&(h.decisionBasis==="pass_rate"&&b.lane.kind==="pass_rate"||h.decisionBasis==="ext_eval"&&b.lane.kind==="ext_eval"&&b.lane.metric===h.decisionMetric));if(h.decisionBasis==="pass_rate"&&_){let b=_.lane;return`[evolve-v3][comparator] Final verdict: ${f} wins. Reason: performance metric expectations_pass_rate (priority=${b.priority}) is higher (baseline=${Ff(b,b.baselineScore)}, treatment=${Ff(b,b.treatmentScore)}).`}if(h.decisionBasis==="ext_eval"&&_&&h.decisionMetric){let b=_.lane;return`[evolve-v3][comparator] Final verdict: ${f} wins. Reason: ext_eval metric "${h.decisionMetric}" (priority=${b.priority}) is higher (baseline=${Ff(b,b.baselineScore)}, treatment=${Ff(b,b.treatmentScore)}; boolean: true beats false; number: higher wins).`}let{baselineAggregate:n,treatmentAggregate:c}=h;if(h.decisionBasis==="token_usage"&&n&&c)return`[evolve-v3][comparator] Final verdict: ${f} wins. `+"Reason: all performance metrics tied or skipped; efficiency tie-break \u2014 lower total tokens "+`(baseline=${n.totalTokens}, treatment=${c.totalTokens}).`;if(h.decisionBasis==="duration"&&n&&c)return`[evolve-v3][comparator] Final verdict: ${f} wins. `+"Reason: all performance metrics tied or skipped; efficiency tie-break \u2014 shorter total duration "+`(baseline=${n.totalDurationSeconds.toFixed(2)}s, treatment=${c.totalDurationSeconds.toFixed(2)}s).`;if(h.decisionBasis==="cost"&&n&&c)return`[evolve-v3][comparator] Final verdict: ${f} wins. `+"Reason: all performance metrics tied or skipped; efficiency tie-break \u2014 lower total cost "+`(baseline=${n.totalCost}, treatment=${c.totalCost}).`;return`[evolve-v3][comparator] Final verdict: ${f} wins. Reason: decisionBasis=${h.decisionBasis}${h.decisionMetric?` metric=${h.decisionMetric}`:""}.`}function Lb(h){return If(h).decision}function cy(h,f,_){let n=Sb(h,f,_);return Lb(n)}import mb from"fs";import q2 from"path";var yy=null;function by(h,f){return{metric:h.metric,priority:h.priority,eval_script:h.eval_script,value_type:"number",value:yy,evidence:f,unavailable:!0,reason:f}}function Nb(h,f){if(!h?.length)return[];return h.map((_)=>by(_,f))}function uy(h,f,_="metric missing from grader ext_eval_results"){if(!f?.length)return h;let n=new Map((h.ext_eval_results??[]).map((b)=>[b.metric,b])),c=f.map((b)=>{return n.get(b.metric)??by(b,_)});return{...h,ext_eval_results:c}}function kf(h,f,_){let n=Nb(_,f);return{unavailable:!0,reason:f,sessionId:h,expectations:[],...n.length>0?{ext_eval_results:n}:{}}}function V2(h,f){let _=h.trim(),n=_.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);if(n)try{return JSON.parse(n[1].trim())}catch(c){throw Error(`Failed to parse ${f} JSON: ${c instanceof Error?c.message:String(c)}`)}if(n=_.match(/```(?:json)?\s*([\s\S]*?)\s*```/i),n)try{return JSON.parse(n[1].trim())}catch(c){throw Error(`Failed to parse ${f} JSON: ${c instanceof Error?c.message:String(c)}`)}if(n=_.match(/(\{[\s\S]*\})\s*$/),n)try{return JSON.parse(n[1].trim())}catch(c){throw Error(`Failed to parse ${f} JSON: ${c instanceof Error?c.message:String(c)}`)}try{return JSON.parse(_)}catch(c){throw Error(`Failed to parse ${f} JSON: ${c instanceof Error?c.message:String(c)}`)}}function M2(h){if(!h||typeof h!=="object"||Array.isArray(h))return;let f=h,_=f.suggestions;if(!Array.isArray(_))return;let n=[];for(let[b,y]of _.entries()){if(!y||typeof y!=="object")continue;let u=y;if(typeof u.reason!=="string"||!u.reason.trim())continue;n.push({reason:u.reason.trim(),assertion:typeof u.assertion==="string"?u.assertion.trim():void 0})}let c=typeof f.overall==="string"&&f.overall.trim()?f.overall.trim():void 0;if(n.length===0&&!c)return;return{suggestions:n,overall:c}}function E2(h){if(h===void 0||h===null)return;if(!Array.isArray(h))throw Error("grader result ext_eval_results must be an array when present");let f=[];for(let[_,n]of h.entries()){if(!n||typeof n!=="object")throw Error(`grader ext_eval_results[${_}] must be an object`);let c=n;for(let $ of["metric","evidence"])if(typeof c[$]!=="string"||!c[$].trim())throw Error(`grader ext_eval_results[${_}].${$} must be a non-empty string`);let b=c.value_type;if(b!=="boolean"&&b!=="number")throw Error(`grader ext_eval_results[${_}].value_type must be "boolean" or "number"`);let y=c.unavailable===!0,u=c.value;if(b==="boolean"){if(typeof u==="string"){if(u==="true")u=!0;else if(u==="false")u=!1}if(y&&(u===null||u===void 0))u=!1;else if(typeof u!=="boolean")throw Error(`grader ext_eval_results[${_}].value must be a boolean`)}else if(y&&(u===null||u===void 0));else if(typeof u==="string"&&u.trim()!==""){let $=Number(u.trim());if(!Number.isFinite($))throw Error(`grader ext_eval_results[${_}].value must be a finite number, or null when unavailable`);u=$}else if(typeof u!=="number"||!Number.isFinite(u))throw Error(`grader ext_eval_results[${_}].value must be a finite number, or null when unavailable`);let U={metric:c.metric.trim(),priority:typeof c.priority==="number"&&Number.isFinite(c.priority)?c.priority:Number.NaN,eval_script:typeof c.eval_script==="string"&&c.eval_script.trim()?c.eval_script.trim():"",value_type:b,value:y&&b==="number"&&(u===null||u===void 0)?yy:u,evidence:c.evidence.trim()};if(typeof c.artifact_path==="string"&&c.artifact_path.trim())U.artifact_path=c.artifact_path.trim();if(typeof c.unavailable==="boolean")U.unavailable=c.unavailable;if(typeof c.reason==="string"&&c.reason.trim())U.reason=c.reason.trim();f.push(U)}return f}function $y(h,f){if(!f?.length||!h.ext_eval_results?.length)return h;let _=new Map(f.map((c)=>[c.metric,c])),n=h.ext_eval_results.map((c)=>{let b=_.get(c.metric);if(!b)return c;return{...c,priority:b.priority,eval_script:c.eval_script?.trim()?c.eval_script:b.eval_script}});return{...h,ext_eval_results:n}}function w_(h){let f=V2(h,"grader");if(!f||typeof f!=="object")throw Error("grader result must be an object");let _=f;if(!Array.isArray(_.expectations))throw Error("grader result expectations must be an array");let n=[];for(let[u,U]of _.expectations.entries()){if(!U||typeof U!=="object")throw Error(`grader expectations[${u}] must be an object`);let $=U;for(let j of["text","evidence"])if(typeof $[j]!=="string")throw Error(`grader expectations[${u}].${j} must be a string`);if(typeof $.passed!=="boolean")throw Error(`grader expectations[${u}].passed must be a boolean`);n.push({text:$.text,passed:$.passed,evidence:$.evidence})}let c={expectations:n};if(typeof _.unavailable==="boolean")c.unavailable=_.unavailable;if(typeof _.reason==="string")c.reason=_.reason;if(typeof _.sessionId==="string")c.sessionId=_.sessionId;let b=M2(_.eval_feedback);if(b)c.eval_feedback=b;let y=E2(_.ext_eval_results);if(y!==void 0)c.ext_eval_results=y;return c}function Q_(h){let f=q2.join(h,"grading","grading.json");if(!mb.existsSync(f))return;try{return w_(mb.readFileSync(f,"utf-8"))}catch{return}}function L(h,f){if(h){h.info(f);return}console.log(f)}function Jh(h,f=20000){let _;try{_=JSON.stringify(h,null,2)}catch{_=String(h)}if(_.length<=f)return _;return`${_.slice(0,f)}
... (truncated ${_.length-f} chars)`}var R2="grading",S2="metrics.json",D2="grading.json",L2="timing.json",m2="ab_comparator_result.json",Vn=0.000000001,Fb=0.5;function Uy(h){if(!Mn.existsSync(h))return;try{return JSON.parse(Mn.readFileSync(h,"utf-8"))}catch{return}}function N2(h){let f=gf.join(h,R2);return{metricsPath:gf.join(f,S2),gradingPath:gf.join(f,D2),timingPath:gf.join(f,L2)}}function F2(h){if(!h)return{passRate:0,passed:0,total:0,unavailable:!0,unavailableReason:"grading.json missing"};if(h.unavailable)return{passRate:0,passed:0,total:0,unavailable:!0,unavailableReason:h.reason??"grading unavailable"};let f=Array.isArray(h.expectations)?h.expectations:[];if(f.length===0)return{passRate:0,passed:0,total:0,unavailable:!1};let _=f.filter((n)=>n?.passed===!0).length;return{passRate:_/f.length,passed:_,total:f.length,unavailable:!1}}function I2(h){if(!h||h.unavailable)return Number.POSITIVE_INFINITY;let f=h.totalTokens;if(!f||typeof f!=="object")return 0;return(f.input??0)+(f.output??0)+(f.reasoning??0)}function k2(h,f){if(h&&!h.unavailable){if(typeof h.duration_seconds==="number")return h.duration_seconds;if(typeof h.duration==="number")return h.duration}if(f&&!f.unavailable){if(typeof f.duration_seconds==="number")return f.duration_seconds;if(typeof f.wall_clock_duration_ms==="number")return f.wall_clock_duration_ms/1000}if(!h||h.unavailable)return Number.POSITIVE_INFINITY;return 0}function g2(h){if(!h||h.unavailable)return Number.POSITIVE_INFINITY;return typeof h.totalCost==="number"?h.totalCost:0}function jy(h){let{metricsPath:f,gradingPath:_,timingPath:n}=N2(h),c=Q_(h),b=c??Uy(_),y=Uy(f),u=Uy(n),U=F2(b);return{worktreePath:h,gradingPath:_,metricsPath:f,timingPath:n,expectationsPassRate:U.passRate,expectationsPassed:U.passed,expectationsTotal:U.total,totalTokens:I2(y),durationSeconds:k2(y,u),totalCost:g2(y),unavailable:U.unavailable||Boolean(y?.unavailable),unavailableReason:U.unavailableReason??y?.reason,extEvalResults:c?.ext_eval_results}}function Ib(h){let f=h.reduce((n,c)=>n+c.expectationsPassed,0),_=h.reduce((n,c)=>n+c.expectationsTotal,0);return{passRate:_>0?f/_:0,expectationsPassed:f,expectationsTotal:_,totalTokens:h.reduce((n,c)=>n+(Number.isFinite(c.totalTokens)?c.totalTokens:0),0),totalDurationSeconds:h.reduce((n,c)=>n+(Number.isFinite(c.durationSeconds)?c.durationSeconds:0),0),totalCost:h.reduce((n,c)=>n+(Number.isFinite(c.totalCost)?c.totalCost:0),0)}}function v_(h){let{baseline:f,treatment:_,extEval:n,baselineSides:c,treatmentSides:b,log:y}=h,u=z_({baselinePassRate:f.passRate,treatmentPassRate:_.passRate,baselineSides:c,treatmentSides:b,extEval:n}),{evaluations:U,decision:$}=If(u);if(y)for(let G of ny(U))y(G);if($){let G=qn({winner:$.winner,decisionBasis:$.decisionBasis,decisionMetric:$.decisionMetric,performanceEvaluations:U,baselineAggregate:f,treatmentAggregate:_});return y?.(G),{winner:$.winner,decisionBasis:$.decisionBasis,decisionMetric:$.decisionMetric,winReason:G,performanceEvaluations:U}}let j="tie",J="tie";if(f.totalTokens+Fb<_.totalTokens)j="baseline",J="token_usage";else if(_.totalTokens+Fb<f.totalTokens)j="treatment",J="token_usage";else if(f.totalDurationSeconds+Vn<_.totalDurationSeconds)j="baseline",J="duration";else if(_.totalDurationSeconds+Vn<f.totalDurationSeconds)j="treatment",J="duration";else if(f.totalCost+Vn<_.totalCost)j="baseline",J="cost";else if(_.totalCost+Vn<f.totalCost)j="treatment",J="cost";let K=qn({winner:j,decisionBasis:J,performanceEvaluations:U,baselineAggregate:f,treatmentAggregate:_});return y?.(K),{winner:j,decisionBasis:J,winReason:K,performanceEvaluations:U}}function Rn(h){return h.questions.map((f)=>({questionId:f.questionId,baselineWorktreePath:f.worktreePathA,treatmentWorktreePath:f.worktreePathB}))}function H_(h){let f=h.abTestDir??En(),_=gf.join(f,h.resultFileName??m2),n=(G)=>{h.logger?.info(G);let Z=h.requestLogFilePath?.trim();if(Z)Y(G,Z)};n(`[evolve-v3][comparator] Comparing A/B for ${h.questions.length} question(s)`);let c=h.questions.map((G)=>{let Z=jy(G.baselineWorktreePath),z=jy(G.treatmentWorktreePath);return n(`[evolve-v3][comparator] ${G.questionId}: baseline passRate=${Z.expectationsPassRate.toFixed(3)} tokens=${Z.totalTokens}; treatment passRate=${z.expectationsPassRate.toFixed(3)} tokens=${z.totalTokens}`),{questionId:G.questionId,baseline:Z,treatment:z}}),b=Ib(c.map((G)=>G.baseline)),y=Ib(c.map((G)=>G.treatment)),{winner:u,decisionBasis:U,decisionMetric:$,winReason:j,performanceEvaluations:J}=v_({baseline:b,treatment:y,extEval:h.extEval,baselineSides:c.map((G)=>G.baseline),treatmentSides:c.map((G)=>G.treatment),log:n}),K={winner:u,decisionBasis:U,...$?{decisionMetric:$}:{},...j?{winReason:j}:{},performanceEvaluations:J,...h.extEval!==void 0?{extEval:h.extEval}:{},baselineAggregate:b,treatmentAggregate:y,perQuestion:c,resultPath:_,comparedAt:new Date().toISOString()};return Mn.mkdirSync(gf.dirname(_),{recursive:!0}),Mn.writeFileSync(_,`${JSON.stringify(K,null,2)}
`,"utf-8"),n(`[evolve-v3][comparator] Result file: ${_}; winner=${u}; basis=${U}${$?`; metric=${$}`:""}`),n(`[evolve-v3][comparator] Summary:
${Jh({winner:u,decisionBasis:U,decisionMetric:$,winReason:j,baselinePassRate:b.passRate,treatmentPassRate:y.passRate,baselineTokens:b.totalTokens,treatmentTokens:y.totalTokens,performanceLaneCount:J.length})}`),K}function Pf(h){if(h==="baseline")return"A";if(h==="treatment")return"B";return"tie"}function kb(h){return{passRate:h.expectationsPassRate,expectationsPassed:h.expectationsPassed,expectationsTotal:h.expectationsTotal,totalTokens:Number.isFinite(h.totalTokens)?h.totalTokens:0,totalDurationSeconds:Number.isFinite(h.durationSeconds)?h.durationSeconds:0,totalCost:Number.isFinite(h.totalCost)?h.totalCost:0}}function Yy(h,f,_){let n=cy(h,f,_);if(n)return{winner:Pf(n.winner),decisionBasis:n.decisionBasis,decisionMetric:n.decisionMetric};let{winner:c,decisionBasis:b,decisionMetric:y}=v_({baseline:kb(h),treatment:kb(f)});return{winner:Pf(c),decisionBasis:b,decisionMetric:y}}import Sn from"fs";import Dn from"path";var P2=["Skill.md","SKILL.md"],Bf="baseline";function l2(h){return`v${h}`}function wh(h){return P2.some((f)=>Sn.existsSync(Dn.join(h,f)))}function d_(h){if(!Sn.existsSync(h))return[];return Sn.readdirSync(h).filter((f)=>/^v\d+$/.test(f)).map((f)=>({dirName:f,versionNum:parseInt(f.substring(1),10)})).filter(({dirName:f})=>wh(Dn.join(h,f))).map(({versionNum:f})=>f).sort((f,_)=>_-f)}function Jy(h,f){for(let _=f-1;_>=0;_-=1){let n=Dn.join(h,l2(_));if(wh(n))return _}return null}function p2(h){return Dn.join(h,Bf)}function O_(h){let f=p2(h);return Sn.mkdirSync(f,{recursive:!0}),f}import{createHash as zu}from"crypto";import o from"fs";import vh from"path";import B_ from"fs";import yh from"path";var e2="verification_scripts";function Ky(h,f){let _=f.trim();if(!_)return null;let n=yh.isAbsolute(_)?yh.resolve(_):yh.resolve(h,_);try{if(!B_.existsSync(n)||!B_.statSync(n).isFile())return null}catch{return null}return n}function r2(h,f){let _=[];try{let n=JSON.parse(f);if(!Array.isArray(n.expectations))return _;for(let c of n.expectations){let b=c.automated_checks??c.automatedChecks;if(!b||typeof b!=="object")continue;let y=b,u=y.scriptPath??y.script_path;if(typeof u!=="string")continue;let U=Ky(h,u);if(U)_.push(U)}}catch{}return _}function gb(h){return`${e2}/${h}`.replace(/\\/g,"/")}function lb(h,f,_,n){let c=nh(h),b=Pb(h,f),y=new Set;for(let $ of n??[]){let j=Ky(c,$);if(j)y.add(j)}for(let $ of r2(c,_))y.add($);let u=new Map;if(y.size>0)B_.mkdirSync(b,{recursive:!0});for(let $ of y){let j=yh.basename($),J=yh.join(b,j);if(B_.existsSync(J)&&yh.resolve($)!==yh.resolve(J)){let K=yh.extname(j),G=yh.basename(j,K);J=yh.join(b,`${G}_${u.size}${K}`)}if(yh.resolve($)!==yh.resolve(J))B_.copyFileSync($,J);u.set($,yh.resolve(J))}let U=_;try{let $=JSON.parse(_);if(Array.isArray($.expectations)){for(let j of $.expectations){let J=null;if(j.automated_checks!==void 0)J="automated_checks";else if(j.automatedChecks!==void 0)J="automatedChecks";if(!J)continue;let K=j[J];if(!K||typeof K!=="object")continue;let G=K,Z=null;if(G.scriptPath!==void 0)Z="scriptPath";else if(G.script_path!==void 0)Z="script_path";if(Z&&typeof G[Z]==="string"){let W=Ky(c,G[Z]),w=W?u.get(W):void 0;if(w)G[Z]=gb(yh.basename(w))}let z=G.commands;if(Array.isArray(z))G.commands=z.map((W)=>{if(typeof W!=="string")return W;let w=W;for(let[v,X]of u){let Q=yh.basename(v),d=gb(yh.basename(X));if(w.includes(Q))w=w.split(Q).join(d)}return w})}U=`${JSON.stringify($,null,2)}
`}}catch{}return{expectationsJson:U,verificationScriptPaths:[...u.values()]}}import mn from"fs";import eb from"fs";import Gy from"fs";function a2(h,f){if(!h||typeof h!=="object"||Array.isArray(h))throw Error(`ext_eval[${f}] must be an object`);let _=h;if(typeof _.metric!=="string"||!_.metric.trim())throw Error(`ext_eval[${f}].metric must be a non-empty string`);if(typeof _.eval_script!=="string"||!_.eval_script.trim())throw Error(`ext_eval[${f}].eval_script must be a non-empty string`);if(typeof _.priority!=="number"||!Number.isFinite(_.priority))throw Error(`ext_eval[${f}].priority must be a finite number`);return{metric:_.metric.trim(),eval_script:_.eval_script.trim(),priority:_.priority}}function lf(h){if(!h||typeof h!=="object"||Array.isArray(h))return;let f=h.ext_eval;if(f===void 0||f===null)return;if(!Array.isArray(f))throw Error("ext_eval must be an array when present");return f.map((_,n)=>a2(_,n))}function A_(h){let f=h.trim();if(!f)return{kind:"absent"};try{let _=JSON.parse(f),n=lf(_);if(n===void 0)return{kind:"absent"};return{kind:"present",entries:n}}catch{return{kind:"absent"}}}function i2(h){return h.map((f)=>({...f}))}function T_(h,f){if(!Gy.existsSync(h))throw Error(`expectations file not found: ${h}`);let _=Gy.readFileSync(h,"utf-8"),n;try{n=JSON.parse(_)}catch(b){let y=b instanceof Error?b.message:String(b);throw Error(`invalid JSON in expectations file ${h}: ${y}`)}if(!n||typeof n!=="object"||Array.isArray(n))throw Error(`expectations root must be a JSON object: ${h}`);let c=n;if(f.kind==="absent")delete c.ext_eval;else c.ext_eval=i2(f.entries);Gy.writeFileSync(h,`${JSON.stringify(c,null,2)}
`,"utf-8")}function pb(h){if(h.length===0)return"(none configured)";return h.map((f,_)=>`${_+1}. metric=${f.metric}, eval_script=${f.eval_script}`).join(`
`)}function Wy(h){if(!eb.existsSync(h))return;let f={path:h,questionCount:0,questionIds:[],coverageSummary:[],qualitySignals:{completeQuestions:0,questionsMissingGradingCriteria:0,questionsMissingAutomatedChecks:0}};try{let _=eb.readFileSync(h,"utf-8"),n=JSON.parse(_),c=lf(n);if(c!==void 0)f.extEval=c;return f}catch{return f}}import oh from"fs";import Yf from"path";import Zy from"fs";function t2(h){return String(h)}function o2(h){let f=R(h),_=f.evalSets.currentVersion,n=f.evalSets.byVersion[t2(_)]?.feedbackPath;if(n&&Zy.existsSync(n))return n;let c=pf(h);if(Zy.existsSync(c))return c;return}function s2(h,f){let _=[`${h}: pass ${f.expectationsPassed}/${f.expectationsTotal}`];if(f.unavailable)return _.push(`unavailable (${f.unavailableReason??"unknown"})`),_.join("; ");let n=f.eval_feedback;if(!n)return _.push("no eval_feedback"),_.join("; ");if(n.overall?.trim())_.push(`overall="${n.overall.trim()}"`);let c=n.suggestions.map((b)=>{let y=b.assertion?.trim();return y?`${y} \u2192 ${b.reason.trim()}`:b.reason.trim()}).filter(Boolean);if(c.length>0)_.push(`suggestions: ${c.join(" | ")}`);return _.join("; ")}function hU(h){return h.questions.map((f)=>{let _=f.sides.map((n)=>s2(n.comparisonRole,n));return`${f.question_id}: ${_.join(" || ")}`})}function fU(h){try{let f=Zy.readFileSync(h,"utf-8"),_=JSON.parse(f);if(!_||typeof _!=="object"||!Array.isArray(_.questions))return;return _}catch{return}}function rb(h){let f=o2(h);if(!f)return;let _=fU(f);if(!_)return{path:f,evalSetVersion:R(h).evalSets.currentVersion,questionCount:0,perQuestionDigest:["(failed to parse eval_set_feedback.json)"],parseError:"invalid or unreadable JSON"};return{path:f,evalSetVersion:_.evalSetVersion,iterationVersion:_.iterationVersion,updatedAt:_.updatedAt,questionCount:_.questions.length,perQuestionDigest:hU(_)}}var _U="skill_evolution_workspace",ab="_evolution_space";function nU(h){let f=h.trim();if(f.startsWith('"')&&f.endsWith('"')||f.startsWith("'")&&f.endsWith("'"))return f.slice(1,-1);return f}function ob(h){if(!oh.existsSync(h))return"";let _=oh.readFileSync(h,"utf-8").match(/^---\r?\n([\s\S]*?)\r?\n---/);if(!_)return"";for(let n of _[1].split(/\r?\n/)){let c=n.indexOf(":");if(c<=0)continue;if(n.slice(0,c).trim()!=="description")continue;return nU(n.slice(c+1))}return""}function ib(h,f){if(!oh.existsSync(h))return[];let _=[];for(let n of oh.readdirSync(h,{withFileTypes:!0})){if(!n.isDirectory())continue;let c=Yf.join(h,n.name),b=Yf.join(c,"SKILL.md");if(!oh.existsSync(b))continue;_.push({name:n.name,description:ob(b),source:f,path:c})}return _}function tb(h,f){return K_(f,{projectDir:h.projectDir,homeDir:h.homeDir})}function cU(h){return[...ib(tb(h,"user"),"user"),...ib(tb(h,"project"),"project")]}function yU(h,f){let _=[];for(let c of oh.readdirSync(h,{withFileTypes:!0})){if(!c.isDirectory())continue;let b=c.name.match(/^v(\d+)$/);if(!b)continue;let y=Number(b[1]),u=Yf.join(h,c.name);if(!oh.existsSync(Yf.join(u,"SKILL.md")))continue;_.push({version:y,dir:u})}if(_.length===0)return;let n=_.sort((c,b)=>b.version-c.version)[0];return{name:f,description:ob(Yf.join(n.dir,"SKILL.md")),source:"evolve",path:n.dir,version:n.version}}function bU(h,f){let _=Yf.join(h,_U);if(!oh.existsSync(_))return;for(let n of oh.readdirSync(_,{withFileTypes:!0})){if(!n.isDirectory())continue;if(!n.name.endsWith(ab))continue;let c=n.name.slice(0,-ab.length);if(!c)continue;let b=Yf.join(_,n.name),y=Yf.join(b,"expectations.json"),u=Wy(y),U=rb(c),$=yU(b,c),j=(J)=>U?{...J,evalSetFeedback:U}:J;if($){let J=f.get(c),K=J?.source!=="evolve"&&J?.path?J.path:$.path,G=J?.description??$.description,Z={...$,path:K,description:G},z=u?{...Z,expectations:u}:Z;f.set(c,j(z));continue}if(u){let J=f.get(c);if(J)f.set(c,j({...J,expectations:u}));else f.set(c,j({name:c,description:"",source:"evolve",path:b,expectations:u}));continue}if(U){let J=f.get(c);if(J)f.set(c,j(J));else f.set(c,j({name:c,description:"",source:"evolve",path:b}))}}}function Ln(h){let f=new Map;for(let _ of cU(h))f.set(_.name,_);return bU(h.evolveRootDir,f),[...f.values()].sort((_,n)=>_.name.localeCompare(n.name))}import Qh from"fs";import hu from"os";import ef from"path";var uU=new Set(["analysis.json"]),$U=/_evidence\.md$/i;function fu(h){if(uU.has(h))return!0;return $U.test(h)}function UU(h,f){return fu(h)}function jU(h,f){let _=f?.logger,n=[];if(!Qh.existsSync(h))return n;for(let c of Qh.readdirSync(h,{withFileTypes:!0})){if(f?.preserveEvolveArtifacts&&fu(c.name))continue;let b=ef.join(h,c.name);Qh.rmSync(b,{recursive:!0,force:!0}),n.push(c.name)}return _?.info(`[clear] removed ${n.length} entries from ${h}`),n}function _u(h,f,_,n,c,b=""){Qh.mkdirSync(f,{recursive:!0});for(let y of Qh.readdirSync(h,{withFileTypes:!0})){let u=b?ef.join(b,y.name):y.name;if(!y.isDirectory()&&UU(y.name,_)){c.push(u);continue}let U=ef.join(h,y.name),$=ef.join(f,y.name);if(y.isDirectory()){_u(U,$,_,n,c,u),n.push(`${u}/`);continue}Qh.copyFileSync(U,$),n.push(u)}}function Xy(h){let f=[],_=[];if(!Qh.existsSync(h.sourceDir))return h.logger?.info(`[copy] source dir missing: ${h.sourceDir}`),{copied:f,skipped:_};return _u(h.sourceDir,h.destDir,h.mode,f,_),h.logger?.info(`[copy] ${h.sourceDir} -> ${h.destDir} (copied=${f.length}, skipped=${_.length})`),{copied:f,skipped:_}}function nu(h){let f=h.logger;Qh.mkdirSync(h.destDir,{recursive:!0}),f?.info(`[replace] start: ${h.sourceDir} -> ${h.destDir} (mode=${h.mode})`);let _=jU(h.destDir,{preserveEvolveArtifacts:h.mode==="sync_back",logger:f});try{let{copied:n,skipped:c}=Xy({sourceDir:h.sourceDir,destDir:h.destDir,mode:h.mode,logger:f});return f?.info(`[replace] done: cleared=${_.length}, copied=${n.length}, skipped=${c.length}`),{copied:n,skipped:c,clearedEntries:_}}catch(n){let c=n instanceof Error?n.message:String(n);throw f?.error(`[replace] FAILED after clearing ${_.length} entries: ${c}`),n}}function sb(h){if(!Qh.existsSync(h))return!1;return Qh.existsSync(ef.join(h,"SKILL.md"))||Qh.existsSync(ef.join(h,"Skill.md"))}function rf(h){if(h.isNew)return"project";let f={projectDir:h.projectDir,homeDir:h.homeDir?.trim()||hu.homedir()},_=Af(h.skillName,"project",f);if(sb(_))return"project";let n=Af(h.skillName,"user",f);if(sb(n))return"user";return"project"}function zy(h){let f=h.logger,_={published:!1,copiedFiles:[],skippedFiles:[]},n=R(h.skillName),c=Jf(n.pointers.head);if(c===null)return f?.info(`[publish] skip ${h.skillName}: head is baseline`),{..._,reason:"head_is_baseline"};let b=x_(h.skillName,c);if(!Qh.existsSync(b))return f?.error(`[publish] skip ${h.skillName}: source version dir missing: ${b}`),{..._,reason:"source_version_missing"};if(!wh(b))return f?.error(`[publish] skip ${h.skillName}: no SKILL.md in ${b}`),{..._,reason:"no_skill_md"};let y={projectDir:h.projectDir,homeDir:h.homeDir?.trim()||hu.homedir()},u=Af(h.skillName,h.targetSource,y);try{let{copied:U,skipped:$,clearedEntries:j}=nu({sourceDir:b,destDir:u,mode:"publish",logger:f});return wy({skillName:h.skillName,version:c,registeredPackagePath:u,registeredTargetSource:h.targetSource}),f?.info(`[publish] ${h.skillName} v${c} -> ${u} (cleared=${j.length}, copied=${U.length}, skipped=${$.length})`),{published:!0,destDir:u,copiedFiles:U,skippedFiles:$,clearedEntries:j}}catch(U){let $=U instanceof Error?U.message:String(U);return f?.error(`[publish] FAILED for ${h.skillName} v${c} -> ${u}: ${$}`),{..._,reason:"copy_failed",destDir:u,error:$}}}function YU(h){let f=h.logger,_={published:!1,copiedFiles:[],skippedFiles:[]},n=R(h.skillName);if(Jf(n.pointers.head)===null)return f?.info(`[publish-auto] skip ${h.skillName}: head is baseline`),{..._,reason:"head_is_baseline"};let b=h.projectDir||process.cwd(),y=rf({skillName:h.skillName,isNew:!1,projectDir:b});return zy({skillName:h.skillName,targetSource:y,projectDir:b,logger:f})}function cu(h){let f=h.logger,_={synced:!1,copiedFiles:[],skippedFiles:[]},n=C_(h.skillName);if(!n)return f?.info(`[sync-back] skip ${h.skillName}: no registered package for head`),{..._,reason:"no_registered_path"};let{headVersion:c,registeredPackagePath:b}=n;if(!Qh.existsSync(b))return f?.error(`[sync-back] skip ${h.skillName}: registered dir missing: ${b}`),{..._,reason:"registered_dir_missing",headVersion:c,sourceDir:b};if(!wh(b))return f?.error(`[sync-back] skip ${h.skillName}: no SKILL.md in ${b}`),{..._,reason:"no_skill_md",headVersion:c,sourceDir:b};let y=x_(h.skillName,c),{copied:u,skipped:U,clearedEntries:$}=nu({sourceDir:b,destDir:y,mode:"sync_back",logger:f});return f?.info(`[sync-back] ${b} -> ${y} (cleared=${$.length}, copied=${u.length})`),{synced:!0,headVersion:c,sourceDir:b,destDir:y,copiedFiles:u,skippedFiles:U}}function Qy(h){let f=h.question_id??h.questionId,_=h.prompt,n=h.expected_behavior??h.expectedBehavior,c=h.project_path??h.projectPath,b=[f,_,n,c];for(let u of b)if(typeof u!=="string"||!u.trim())return!1;let y=h.grading_criteria??h.gradingCriteria;if(y!==void 0&&(typeof y!=="string"||!y.trim()))return!1;return!0}function vy(h){if(!h||typeof h!=="object")return null;let f=h;if(!Qy(f))return null;let _={question_id:String(f.question_id??f.questionId).trim(),prompt:String(f.prompt).trim(),expected_behavior:String(f.expected_behavior??f.expectedBehavior).trim(),project_path:String(f.project_path??f.projectPath).trim()},n=f.grading_criteria??f.gradingCriteria;if(typeof n==="string"&&n.trim())_.grading_criteria=n.trim();let c=f.automated_checks??f.automatedChecks;if(c!==void 0)_.automated_checks=c;return _}function dy(h,f){if(typeof h!=="boolean")throw Error("isNew must be a boolean");if(typeof f!=="string"||!f.trim())throw Error("intention must be a non-empty string")}function M_(h){if(!Array.isArray(h))throw Error("expectations must be an array");let f=h.map((_)=>vy(_)).filter((_)=>_!==null);if(f.length===0)throw Error("expectations must contain at least one valid question (all items were invalid and filtered out)");return f}function Nn(h,f){let _=f.intention.trim();return h.map((n)=>({questionId:n.question_id,isNew:f.isNew,intention:_,prompt:n.prompt,expectedBehavior:n.expected_behavior,gradingCriteria:n.grading_criteria,automatedChecks:n.automated_checks,projectPath:n.project_path}))}function E_(h,f={}){let _=f.normalizeQuestions??!0;if(h&&typeof h==="object"&&!Array.isArray(h)){let n=h,c=n.expectations;if(!Array.isArray(c))throw Error("expectations root must include an expectations array");if(typeof n.isNew!=="boolean")throw Error("isNew must be a boolean");if(typeof n.intention!=="string"||!n.intention.trim())throw Error("intention must be a non-empty string");let b=_?c.map(($)=>vy($)).filter(($)=>$!==null):c.filter(($)=>$&&typeof $==="object"&&Qy($));if(b.length===0)throw Error("expectations must contain at least one valid question (all items were invalid and filtered out)");let y=typeof n.skillName==="string"&&n.skillName.trim()?n.skillName.trim():void 0,u=lf(n),U=n.targetSource==="user"||n.targetSource==="project"?n.targetSource:void 0;return{skillName:y,isNew:n.isNew,intention:n.intention.trim(),expectations:b,ext_eval:u,targetSource:U}}if(Array.isArray(h)){if(h.length===0)throw Error("expectations must contain at least one question");let n=h[0];if(typeof n.is_new==="boolean"){let c=n.is_new;for(let u=0;u<h.length;u++){let U=h[u];if(typeof U.is_new!=="boolean"||U.is_new!==c)throw Error(`Legacy expectations array: all items must share the same is_new (mismatch at index ${u})`)}if(typeof n.intention!=="string"||!n.intention.trim())throw Error("Legacy expectations array: intention must be a non-empty string on each item (use first item)");let b=n.intention.trim(),y=_?h.map((u)=>vy(u)).filter((u)=>u!==null):h.filter((u)=>u&&typeof u==="object"&&Qy(u));if(y.length===0)throw Error("expectations must contain at least one valid question (all items were invalid and filtered out)");return{isNew:c,intention:b,expectations:y}}throw Error("Expectations payload must be an object with isNew, intention, and expectations[], or a legacy array whose items include is_new and intention")}throw Error("Expectations payload must be a JSON object or array")}function Kf(h){let f=Hy(h);if(!mn.existsSync(f))throw Error(`expectations file not found: ${f}`);let _=mn.readFileSync(f,"utf-8"),n;try{n=JSON.parse(_)}catch(c){let b=c instanceof Error?c.message:String(c);throw Error(`invalid JSON in expectations file ${f}: ${b}`)}return E_(n,{normalizeQuestions:!1})}function af(h,f){let _=Hy(h),n=mn.readFileSync(_,"utf-8"),c;try{c=JSON.parse(n)}catch(y){let u=y instanceof Error?y.message:String(y);throw Error(`invalid JSON in expectations file ${_}: ${u}`)}let b=rf({skillName:f.skillName,isNew:f.isNew,projectDir:f.projectDir,homeDir:f.homeDir});return c.targetSource=b,mn.writeFileSync(_,`${JSON.stringify(c,null,2)}
`,"utf-8"),b}var Eh="baseline";import JU from"fs";import Oy from"path";function uu(h){let f=h?.reason?.trim()||"manifest_write_unspecified",_=h?.origin?.trim();return _?`${_}:${f}`:f}function KU(h){return h.replace(/[\\/:*?"<>|]/g,"_").trim()||"unknown"}function $u(){let h=Oy.join(I(),"logs","version-pointer");return JU.mkdirSync(h,{recursive:!0}),h}function GU(h,f){let _=Oy.join($u(),`${KU(h)}.log`);Y(f,_)}function WU(h){let f=Oy.join($u(),"_admin-panel.log");Y(h,f)}function yu(h){return String(h)}function bu(h){if(!h)return"(none)";if(h.capability?.unavailable)return"unavailable";let f=h.capability;return`passRate=${f.passRate} passed=${f.expectationsPassed}/${f.expectationsTotal}`}function Fn(h){return JSON.stringify(h)}function Kh(h,f,_,n){if(f===_)return;n.push(`${h}: ${Fn(f)} -> ${Fn(_)}`)}function ZU(h,f,_,n){let c=`evalSets.byVersion[${h}]`;if(!f&&_){n.push(`${c}: (added) questionCount=${_.questionCount}`);return}if(f&&!_){n.push(`${c}: (removed)`);return}if(!f||!_)return;Kh(`${c}.questionCount`,f.questionCount,_.questionCount,n),Kh(`${c}.questionIdsFingerprint`,f.questionIdsFingerprint,_.questionIdsFingerprint,n),Kh(`${c}.path`,f.path,_.path,n),Kh(`${c}.is_pin`,f.is_pin===!0,_.is_pin===!0,n),Kh(`${c}.feedbackPath`,f.feedbackPath??null,_.feedbackPath??null,n);let b=f.verificationScriptPaths??[],y=_.verificationScriptPaths??[];if(Fn(b)!==Fn(y))n.push(`${c}.verificationScriptPaths: ${b.length} -> ${y.length} script(s)`)}function XU(h,f,_,n){let c=`versions[${h}]`;if(!f&&_){n.push(`${c}: (added) initReason=${_.initReason} dir=${_.dir}`);return}if(f&&!_){n.push(`${c}: (removed)`);return}if(!f||!_)return;Kh(`${c}.initReason`,f.initReason,_.initReason,n),Kh(`${c}.derivedBy`,f.derivedBy,_.derivedBy,n),Kh(`${c}.evidencePath`,f.evidencePath??null,_.evidencePath??null,n),Kh(`${c}.success_mechanism`,f.success_mechanism??null,_.success_mechanism??null,n),Kh(`${c}.failure_mechanism`,f.failure_mechanism??null,_.failure_mechanism??null,n),Kh(`${c}.evalSetVersion`,f.evalSetVersion,_.evalSetVersion,n);let b=bu(f.metrics),y=bu(_.metrics);if(b!==y)n.push(`${c}.metrics: ${b} -> ${y}`)}function Uu(h,f){if(!h)return["manifest_created"];let _=[];Kh("pointers.head",yu(h.pointers.head),yu(f.pointers.head),_),Kh("defaults.referenceTopNCount",h.defaults.referenceTopNCount,f.defaults.referenceTopNCount,_),Kh("evalSets.currentVersion",h.evalSets.currentVersion,f.evalSets.currentVersion,_);let n=new Set([...Object.keys(h.evalSets.byVersion),...Object.keys(f.evalSets.byVersion)]);for(let b of[...n].sort((y,u)=>Number(y)-Number(u)))ZU(b,h.evalSets.byVersion[b],f.evalSets.byVersion[b],_);let c=new Set([...Object.keys(h.versions),...Object.keys(f.versions)]);for(let b of[...c].sort((y,u)=>Number(y)-Number(u)))XU(b,h.versions[b],f.versions[b],_);return _}function By(h,f,_,n,c,b){let y=_.length>0?_.join("; "):"(no tracked field diff; normalized rewrite)",u=c?` origin=${c}`:"",U=`[version-pointer][manifest] skill=${h} reason=${f}${u} path=${n} | ${y}`;if(b)Y(U,b);if(GU(h,U),c==="admin_panel")WU(U)}function Jf(h){return h===Eh?null:h}function C_(h){let f=R(h),_=Jf(f.pointers.head);if(_===null)return null;let n=f.versions[hh(_)],c=n?.registeredPackagePath?.trim();if(!c)return null;return{headVersion:_,registeredPackagePath:c,registeredTargetSource:n.registeredTargetSource}}function wy(h){let f=ch(h.skillName),_=hh(h.version);if(!f.versions[_])Hh(h.skillName,h.version,{initReason:"continued_evolution"});let n=R(h.skillName),c=n.versions[_];if(!c)throw Error(`Version record missing after register: ${h.skillName} v${h.version}`);return c.registeredPackagePath=vh.resolve(h.registeredPackagePath),c.registeredTargetSource=h.registeredTargetSource,c.registeredPublishedAt=Rh(),n.updatedAt=Rh(),Yh(h.skillName,n,{reason:`registered_package_path:v${h.version}`}),R(h.skillName)}function Ey(h){return h===Eh?Eh:`v${h}`}function zU(h,f){if(h===Eh)return Eh;if(typeof h==="number"&&Number.isInteger(h)&&h>=0)return h;return f}var kn=3;function Rh(){return new Date().toISOString()}function hh(h){return String(h)}var Gf=Eh;function Ay(h,f,_){return{dir:typeof f.dir==="string"?f.dir:_.dir,initReason:f.initReason??_.initReason,derivedBy:Array.isArray(f.derivedBy)?[...new Set(f.derivedBy.filter((n)=>Number.isInteger(n)&&n>=0))].sort((n,c)=>c-n):[],createdAt:typeof f.createdAt==="string"?f.createdAt:Rh(),evalSetVersion:Number.isInteger(f.evalSetVersion)?Number(f.evalSetVersion):_.evalSetVersion,evalSetPath:typeof f.evalSetPath==="string"?f.evalSetPath:kh(h),evidencePath:typeof f.evidencePath==="string"?f.evidencePath:void 0,success_mechanism:ju(f,"success_mechanism","successMechanism"),failure_mechanism:ju(f,"failure_mechanism","failureMechanism"),metrics:f.metrics,registeredPackagePath:typeof f.registeredPackagePath==="string"?f.registeredPackagePath:void 0,registeredTargetSource:f.registeredTargetSource==="user"||f.registeredTargetSource==="project"?f.registeredTargetSource:void 0,registeredPublishedAt:typeof f.registeredPublishedAt==="string"?f.registeredPublishedAt:void 0}}function In(h){let f=kh(h),_=Rh();return{schemaVersion:1,skillName:h,updatedAt:_,pointers:{head:Eh},defaults:{referenceTopNCount:kn},evalSets:{currentVersion:0,byVersion:{"0":{path:f,questionCount:0,questionIdsFingerprint:wu([]),createdAt:_}}},versions:{[Gf]:{dir:Bf,initReason:"new_skill_baseline_empty",derivedBy:[],createdAt:_,evalSetVersion:0,evalSetPath:f,metrics:Ry()}}}}function wu(h){return`sha256:${zu("sha256").update(JSON.stringify(h)).digest("hex")}`}function qy(h){if(Array.isArray(h))return h.map((f)=>qy(f));if(h&&typeof h==="object"){let f=h,_={};for(let n of Object.keys(f).sort())_[n]=qy(f[n]);return _}return h}function Qu(h){let f=qy(h);return`sha256:${zu("sha256").update(JSON.stringify(f)).digest("hex")}`}function vu(h){try{return Qu(JSON.parse(h))}catch{return null}}function Ty(h,f){let _=h?.trim();if(_){let n=vu(_);if(n)return n}return Qu({expectations:f})}function Ry(){return{capability:{passRate:0,expectationsPassed:0,expectationsTotal:0,unavailable:!0},efficiency:{totalTokens:Number.POSITIVE_INFINITY,durationSeconds:Number.POSITIVE_INFINITY,totalCost:Number.POSITIVE_INFINITY,unavailable:!0},extensions:{}}}function ju(h,f,_){let n=h;if(typeof n[f]==="string")return n[f];if(typeof n[_]==="string")return n[_];return}function wU(h,f,_){let n=h,c=n[f]??n[_];if(!Array.isArray(c))return;let b=[...new Set(c.filter((y)=>typeof y==="string"&&y.trim().length>0))];return b.length>0?b:void 0}function Sy(h,f){let _=In(f),n={};if(h.versions&&typeof h.versions==="object")for(let[y,u]of Object.entries(h.versions)){if(!u||typeof u!=="object")continue;if(y===Gf){n[y]=Ay(f,u,{dir:Bf,initReason:"new_skill_baseline_empty",evalSetVersion:_.evalSets.currentVersion});continue}let U=Number(y);if(!Number.isInteger(U)||U<0)continue;n[y]=Ay(f,u,{dir:`v${U}`,initReason:"continued_evolution",evalSetVersion:_.evalSets.currentVersion})}if(!n[Gf])n[Gf]=Ay(f,{},{dir:Bf,initReason:"new_skill_baseline_empty",evalSetVersion:_.evalSets.currentVersion}),n[Gf].metrics=Ry();let c={..._.evalSets.byVersion};if(h.evalSets?.byVersion&&typeof h.evalSets.byVersion==="object")for(let[y,u]of Object.entries(h.evalSets.byVersion)){if(!u||typeof u!=="object")continue;c[y]={path:u.path??kh(f),questionCount:Number(u.questionCount)||0,questionIdsFingerprint:u.questionIdsFingerprint??wu([]),createdAt:u.createdAt??Rh(),feedbackPath:typeof u.feedbackPath==="string"?u.feedbackPath:void 0,verificationScriptPaths:wU(u,"verification_script_paths","verificationScriptPaths"),is_pin:u.is_pin===!0}}let b=zU(h.pointers?.head,_.pointers.head);return{schemaVersion:1,skillName:f,updatedAt:typeof h.updatedAt==="string"?h.updatedAt:Rh(),pointers:{head:b},defaults:{referenceTopNCount:h.defaults&&Number.isInteger(h.defaults.referenceTopNCount)&&h.defaults.referenceTopNCount>0?h.defaults.referenceTopNCount:kn},evalSets:{currentVersion:h.evalSets&&Number.isInteger(h.evalSets.currentVersion)&&h.evalSets.currentVersion>=0?h.evalSets.currentVersion:_.evalSets.currentVersion,byVersion:c},versions:n}}function R(h){let f=S_(h);if(!o.existsSync(f))return In(h);try{let _=JSON.parse(o.readFileSync(f,"utf-8"));return Sy(_,h)}catch{return In(h)}}function Yu(h){let f=S_(h);if(!o.existsSync(f))return null;try{let _=JSON.parse(o.readFileSync(f,"utf-8"));return Sy(_,h)}catch{return null}}function Yh(h,f,_){let n=uu(_),c=Yu(h);My(h);let b=Sy(f,h);QU(b,h),b.updatedAt=Rh(),b.skillName=h;let y=S_(h),u=Uu(c,b);By(h,n,u,y,_?.origin,_?.requestLogFilePath);let U=`${y}.tmp`;o.writeFileSync(U,`${JSON.stringify(b,null,2)}
`,"utf-8"),o.renameSync(U,y);let $=Yu(h);if($&&$.updatedAt!==b.updatedAt)throw By(h,"lost_update_detected",[],y,void 0,_?.requestLogFilePath),Error(`Lost update detected for skill="${h}": onDisk updatedAt=${$.updatedAt} != written updatedAt=${b.updatedAt}. Another process may have overwritten the manifest concurrently.`)}function tf(h,f){let _=h.versions[hh(f)];if(!_?.metrics)return!1;let n=_.metrics.capability,c=_.metrics.efficiency;if(n?.unavailable)return!1;if(c?.unavailable)return!1;return!0}function QU(h,f){let _=kh(f),n=Rh(),c=h.versions[Gf];h.versions[Gf]={dir:Bf,initReason:c?.initReason??"new_skill_baseline_empty",derivedBy:c?.derivedBy??[],createdAt:c?.createdAt??n,evalSetVersion:c?.evalSetVersion??h.evalSets.currentVersion,evalSetPath:c?.evalSetPath??_,evidencePath:c?.evidencePath,success_mechanism:c?.success_mechanism,failure_mechanism:c?.failure_mechanism,metrics:c?.metrics}}function Ju(h){return{passRate:h.capability.passRate,expectationsPassed:h.capability.expectationsPassed,expectationsTotal:h.capability.expectationsTotal,totalTokens:Number.isFinite(h.efficiency.totalTokens)?h.efficiency.totalTokens:0,totalDurationSeconds:Number.isFinite(h.efficiency.durationSeconds)?h.efficiency.durationSeconds:0,totalCost:Number.isFinite(h.efficiency.totalCost)?h.efficiency.totalCost:0}}function vU(h,f,_){let n=h.versions[hh(f)],c=h.versions[hh(_)];if(!n?.metrics||!c?.metrics){if(tf(h,_)&&!tf(h,f))return 1;if(tf(h,f)&&!tf(h,_))return-1;return _-f}let{winner:b}=v_({baseline:Ju(n.metrics),treatment:Ju(c.metrics)});if(b==="treatment")return 1;if(b==="baseline")return-1;return _-f}function Dy(h,f={}){let _=R(h);return R_(_,f)}function Hu(h,f={}){let _=R(h);return R_(_,f).map((c)=>{let y=_.versions[hh(c)]?.metrics?.capability;if(!y||y.unavailable)return{version:c,passRate:0,expectationsPassed:0,expectationsTotal:0,unavailable:!0};return{version:c,passRate:y.passRate,expectationsPassed:y.expectationsPassed,expectationsTotal:y.expectationsTotal}})}function R_(h,f={}){let _=f.n??h.defaults.referenceTopNCount??kn,n=f.evalSetVersion??h.evalSets.currentVersion;while(n>=0){let c=Object.entries(h.versions).map(([b,y])=>({version:Number(b),rec:y})).filter(({version:b,rec:y})=>y.evalSetVersion===n&&tf(h,b)).map(({version:b})=>b).sort((b,y)=>vU(h,b,y));if(c.length>0)return c.slice(0,_);n-=1}return[]}function HU(h,f={}){let _=R(h),n=Jf(_.pointers.head);if(!f.recompute){if(n!==null)return n;return R_(_,{n:1,evalSetVersion:f.evalSetVersion})[0]??null}return R_(_,{n:1,evalSetVersion:f.evalSetVersion})[0]??n}function dU(h){let f=R(h),_=null;for(let n of Object.keys(f.versions)){let c=Number(n);if(!tf(f,c))continue;if(_===null||c>_)_=c}return _}function Ly(h){return{...R(h),derived:{latestEvaluated:dU(h),bestOverall:HU(h),referenceTopN:Dy(h)}}}function Wf(h,f){let _=R(h),n=Jf(_.pointers.head);if(n===null)return;let c=nh(h),b=vh.join(c,`v${n}`);if(!wh(b))return;return n}function OU(h){let f=d_(h);if(f.length>0)return f[0];return Eh}function BU(h){let f=vh.join(h,Bf);if(o.existsSync(f))return;let _=vh.join(h,"v0");if(o.existsSync(_)&&!wh(_))O_(h)}function ch(h){let f=S_(h),_=nh(h),n=kh(h);if(o.existsSync(f))return R(h);My(h);let c=In(h);c.pointers.head=OU(_);let b=d_(_).sort((y,u)=>y-u);for(let y of b){let u=hh(y);c.versions[u]={dir:`v${y}`,initReason:"continued_evolution",derivedBy:y>0?[y-1]:[],createdAt:Rh(),evalSetVersion:0,evalSetPath:n,metrics:Ry()}}return BU(_),Yh(h,c,{reason:"initial_manifest_created_from_disk"}),c}function gn(h){let f=ch(h.skillName);if(h.setHeadToCandidate)f.pointers.head=h.candidateVersion,Yh(h.skillName,f,{reason:`workspace_prep_set_head_to_candidate:v${h.candidateVersion}`});return Hh(h.skillName,h.candidateVersion,{initReason:h.initReason,derivedBy:h.candidateVersion===0&&h.isNew?[]:void 0}),R(h.skillName)}function du(h,f){let _=nh(h);O_(_),ch(h);let n=R(h);return n.pointers.head=Eh,Yh(h,n,{reason:"new_skill_first_batch_set_head_baseline"}),Hh(h,f,{initReason:"continued_evolution",derivedBy:[]}),R(h)}function Hh(h,f,_){let n=ch(h),c=kh(h),b=hh(f),y=n.versions[b];return n.versions[b]={dir:`v${f}`,initReason:_.initReason,derivedBy:_.derivedBy??y?.derivedBy??[],createdAt:y?.createdAt??Rh(),evalSetVersion:n.evalSets.currentVersion,evalSetPath:c,evidencePath:y?.evidencePath,success_mechanism:y?.success_mechanism,failure_mechanism:y?.failure_mechanism,metrics:y?.metrics,registeredPackagePath:y?.registeredPackagePath,registeredTargetSource:y?.registeredTargetSource,registeredPublishedAt:y?.registeredPublishedAt},Yh(h,n,{reason:`register_skill_version:v${f}:${_.initReason}`}),n}function Ou(h,f){return vh.join(nh(h),`v${f}`,"analysis.json")}function my(h,f,_){if(!_.successMechanismPath&&!_.failureMechanismPath)return R(h);let n=ch(h),c=hh(f);if(!n.versions[c])Hh(h,f,{initReason:"continued_evolution"});let b=R(h),y=b.versions[c];if(!y)throw Error(`Version record missing after register: ${h} v${f}`);if(_.successMechanismPath)y.success_mechanism=vh.resolve(_.successMechanismPath);if(_.failureMechanismPath)y.failure_mechanism=vh.resolve(_.failureMechanismPath);return Yh(h,b,{reason:`ab_analyzer_mechanism_paths:v${f}`}),R(h)}function Bu(h,f,_){let n=ch(h),c=hh(f);if(!n.versions[c])Hh(h,f,{initReason:"continued_evolution"});let b=vh.resolve(_),y=R(h),u=y.versions[c];if(!u)throw Error(`Version record missing after register: ${h} v${f}`);return u.evidencePath=b,Yh(h,y,{reason:`skill_author_evidence_path:v${f}`}),R(h)}function Au(h,f,_){let n=ch(h),c=hh(f),b=n.versions[c];if(!b)return Hh(h,f,{initReason:"continued_evolution",derivedBy:_}),R(h);let y=[...new Set(_.filter((u)=>Number.isInteger(u)&&u>=0&&u<f))].sort((u,U)=>U-u);return b.derivedBy=y,Yh(h,n,{reason:`skill_author_derived_by:v${f}`}),n}function Tu(h,f){let _=R(h),n=_.defaults.referenceTopNCount??kn;return R_(_,{n}).filter((c)=>c>=0&&c<f)}function xy(h,f,_="link_eval_set_version",n){let c=ch(h),b=hh(f.version),y=c.evalSets.byVersion[b];c.evalSets.currentVersion=f.version;let u=f.verificationScriptPaths!==void 0?[...new Set(f.verificationScriptPaths.map((U)=>U.trim()).filter(Boolean).map((U)=>vh.resolve(U)))]:y?.verificationScriptPaths;return c.evalSets.byVersion[b]={path:f.path,questionCount:f.questionCount,questionIdsFingerprint:f.questionIdsFingerprint,createdAt:y?.createdAt??Rh(),is_pin:y?.is_pin===!0,feedbackPath:f.feedbackPath!==void 0?vh.resolve(f.feedbackPath):y?.feedbackPath,verificationScriptPaths:u},Yh(h,c,{reason:`${_}:eval_set_v${f.version}`,origin:n?.origin,requestLogFilePath:n?.requestLogFilePath}),c}function Pn(h){let f=R(h);return f.evalSets.byVersion[hh(f.evalSets.currentVersion)]?.is_pin===!0}function xu(h,f,_){let n=ch(h),c=hh(f),b=n.evalSets.byVersion[c];if(!b)throw Error(`Cannot link eval-set feedback: manifest has no evalSets.byVersion[${f}] for ${h}`);return b.feedbackPath=vh.resolve(_),Yh(h,n,{reason:`eval_set_feedback_linked:v${f}`}),R(h)}function Vy(h){try{let f=JSON.parse(h);return Array.isArray(f.expectations)?f.expectations:[]}catch{return[]}}function AU(h){return Vy(h).length}function Cu(){let h=new Map;for(let f of Xu()){let _=kh(f.skillName);if(!o.existsSync(_))continue;try{h.set(f.skillName,o.readFileSync(_,"utf-8"))}catch{}}return h}function ln(h,f,_){let n=ch(h),c=kh(h),b=f.writtenExpectationsJson?.trim(),y=f.previousExpectationsJson?.trim(),u=Ty(b,f.expectations),U=f.expectations.length,$=hh(n.evalSets.currentVersion),j=n.evalSets.byVersion[$],J=Boolean(y)||(j?.questionCount??0)>0,K=null;if(y)K=Ty(y,Vy(y));else if(J&&o.existsSync(c))try{let Z=o.readFileSync(c,"utf-8");K=vu(Z)??Ty(void 0,Vy(Z))}catch{K=null}let G=o.existsSync(c);if(J&&K!==null&&K!==u&&(G||Boolean(y))){let Z=n.evalSets.currentVersion,z=Gu(h,Z);Zu(h),o.mkdirSync(vh.dirname(z),{recursive:!0});let W;if(y)if(y.endsWith(`
`))W=y;else W=`${y}
`;else W=o.readFileSync(c,"utf-8");let w=lb(h,Z,W,j?.verificationScriptPaths);W=w.expectationsJson,o.writeFileSync(z,W,"utf-8");let v=pf(h),X;if(o.existsSync(v))X=Wu(h,Z),o.mkdirSync(vh.dirname(X),{recursive:!0}),o.copyFileSync(v,X);let Q=n.evalSets.byVersion[hh(Z)]?.questionCount??(y?AU(y):(()=>{try{let B=JSON.parse(o.readFileSync(c,"utf-8"));return Array.isArray(B.expectations)?B.expectations.length:0}catch{return 0}})());xy(h,{version:Z,path:z,questionCount:Q,questionIdsFingerprint:K,feedbackPath:X,verificationScriptPaths:w.verificationScriptPaths},"expectations_archive_prior_eval_set",_);let d=Z+1;xy(h,{version:d,path:c,questionCount:U,questionIdsFingerprint:u},"expectations_archive_register_new_eval_set",_)}else xy(h,{version:n.evalSets.currentVersion,path:c,questionCount:U,questionIdsFingerprint:u},J?"expectations_sync_unchanged_fingerprint":"expectations_first_write_link_eval_set",_);return R(h)}var TU=0.000000001;function qu(h){if(h.performanceEvaluations?.length)return h.performanceEvaluations;let{evaluations:f}=If(z_({baselinePassRate:h.baselineAggregate.passRate,treatmentPassRate:h.treatmentAggregate.passRate,baselineSides:h.perQuestion.map((_)=>_.baseline),treatmentSides:h.perQuestion.map((_)=>_.treatment),extEval:h.extEval}));return f}function xU(h,f){let _=new Set;for(let n of h??[])for(let c of n.extEvalResults??[]){if(c.metric!==f||c.unavailable===!0)continue;if(c.value_type==="boolean"||c.value_type==="number")_.add(c.value_type)}return _}function CU(h,f){if(f==="boolean")return h>=0.5-TU;return h}function qU(h,f,_){let n=xU(f,_);if(n.size===1)return[...n][0];if(n.has("number"))return"number";if(h===0||h===1)return"boolean";return"number"}function Vu(h,f,_,n){if(!_?.length)return[];let c=new Map(_.map((y)=>[y.metric,y.priority])),b=[];for(let y of h){if(y.lane.kind!=="ext_eval")continue;let u=y.lane.metric,U=c.get(u)??y.lane.priority,$=f==="baseline"?y.lane.baselineScore:y.lane.treatmentScore;if($===void 0){b.push({metric:u,priority:U,valueType:"boolean",value:!1,unavailable:!0,unavailableReason:"no aggregate score for this side"});continue}let j=qU($,n,u);b.push({metric:u,priority:U,valueType:j,value:CU($,j)})}return b.sort((y,u)=>u.priority-y.priority||y.metric.localeCompare(u.metric))}function VU(h){let f=h.treatmentAggregate,_=qu(h),n=Vu(_,"treatment",h.extEval,h.perQuestion.map((c)=>c.treatment));return{capability:{passRate:f.passRate,expectationsPassed:f.expectationsPassed,expectationsTotal:f.expectationsTotal,unavailable:!1,...n.length>0?{extEval:n}:{}},efficiency:{totalTokens:f.totalTokens,durationSeconds:f.totalDurationSeconds,totalCost:f.totalCost,timingSource:"comparator_treatment_aggregate",unavailable:!1},extensions:{}}}function Ku(h){let f=h.baselineAggregate,_=qu(h),n=Vu(_,"baseline",h.extEval,h.perQuestion.map((c)=>c.baseline));return{capability:{passRate:f.passRate,expectationsPassed:f.expectationsPassed,expectationsTotal:f.expectationsTotal,unavailable:!1,...n.length>0?{extEval:n}:{}},efficiency:{totalTokens:f.totalTokens,durationSeconds:f.totalDurationSeconds,totalCost:f.totalCost,timingSource:"comparator_baseline_aggregate",unavailable:!1},extensions:{}}}function Cy(h,f,_,n){h.metrics=f,h.evalSetVersion=_,h.evalSetPath=n}function Ny(h,f){ch(h);let _=R(h),n=f.evalSetVersion??_.evalSets.currentVersion,c=kh(h),b=f.baselineSkillVersion??Jf(_.pointers.head)??void 0,y=new Set([f.candidateVersion]);if(b!==void 0&&b!==f.candidateVersion)y.add(b);for(let $ of y)if(!_.versions[hh($)])Hh(h,$,{initReason:"continued_evolution"});if(_=R(h),Cy(_.versions[hh(f.candidateVersion)],VU(f.comparator),n,c),b!==void 0&&b!==f.candidateVersion)Cy(_.versions[hh(b)],Ku(f.comparator),n,c);else{let $=_.versions[Gf];if($)Cy($,Ku(f.comparator),n,c)}if(f.comparator.winner==="treatment")_.pointers.head=f.candidateVersion;let u=b!==void 0?`_baseline_v${b}`:"_baseline_slot",U=f.comparator.winner==="treatment"?`_head_advanced_to_v${f.candidateVersion}`:"_head_unchanged";return Yh(h,_,{reason:`comparator_record_metrics:v${f.candidateVersion}:evalSet=${n}:winner=${f.comparator.winner}${u}${U}`}),R(h)}function Fy(h){ch(h.skillName);let f=R(h.skillName),_=hh(h.version),n=f.versions[_];if(!n){Hh(h.skillName,h.version,{initReason:"continued_evolution"});let c=R(h.skillName);if(n=c.versions[_],!n)return c;Object.assign(f,c)}if(!n.metrics)n.metrics={capability:{passRate:0,expectationsPassed:0,expectationsTotal:0,unavailable:!0,unavailableReason:"observability_summary_only"},efficiency:{totalTokens:0,durationSeconds:0,totalCost:0,unavailable:!0,unavailableReason:"observability_summary_only"},extensions:{}};return n.metrics.extensions={...n.metrics.extensions,observabilitySummary:h.summary,...h.attemptId?{observabilityAttemptId:h.attemptId}:{}},Yh(h.skillName,f,{reason:`observability_summary:v${h.version}`}),R(h.skillName)}import sh from"fs";import D_ from"path";var Mu="## Bundled Resources",MU=/^(references|scripts|examples|templates|assets)\//,EU=/`([^`]+)`/;function RU(h){let f=h.trim().replace(/\\/g,"/");if(!f||f.startsWith("/")||/^[a-zA-Z]:/.test(f))return;if(f.includes(".."))return;if(!MU.test(f))return;return f}function SU(h){let f=h.indexOf(Mu);if(f<0)return"";let _=h.slice(f+Mu.length),n=_.search(/\n## /);return n>=0?_.slice(0,n):_}function Eu(h){let f=SU(h);if(!f.trim())return[];let _=new Set;for(let n of f.split(`
`)){let c=n.trim();if(!c.startsWith("-"))continue;let b=EU.exec(c);if(!b)continue;let y=RU(b[1]);if(y)_.add(y)}return[..._].sort()}function Ru(h,f){if(f!==void 0)return f;let _=D_.join(h,"SKILL.md");if(!sh.existsSync(_))return"";return sh.readFileSync(_,"utf-8")}function Su(h,f){let _=h.trim(),n=Ru(_,f);return Eu(n).map((b)=>{let y=D_.join(_,...b.split("/")),u=sh.existsSync(y)?"present":"missing";return{relativePath:b,absolutePath:y,status:u}})}function DU(h,f){sh.mkdirSync(D_.dirname(f),{recursive:!0}),sh.copyFileSync(h,f)}function Du(h,f,_){let n={copied:[],skippedExisting:[],missingInSource:[]},c=h.trim(),b=f.trim();if(!c||!b||!sh.existsSync(c)||!sh.existsSync(b))return n;let y=Ru(c,_),u=Eu(y);for(let U of u){let $=D_.join(c,...U.split("/"));if(sh.existsSync($)){n.skippedExisting.push(U);continue}let j=D_.join(b,...U.split("/"));if(!sh.existsSync(j)){n.missingInSource.push(U);continue}DU(j,$),n.copied.push(U)}return n}function Lu(h,f){let _=f.filter((y)=>y.status==="present"),n=f.filter((y)=>y.status==="missing"),c=_.length>0?_.map((y)=>`- Read \`${y.absolutePath}\` (${y.relativePath})`).join(`
`):"- (no bundled resource files on disk under Bundled Resources)",b=n.length>0?`
## Declared but missing on disk

These paths are listed in SKILL.md Bundled Resources but are not present in the skill package (do not invent their contents):
${n.map((y)=>`- \`${y.relativePath}\``).join(`
`)}
`:"";return`## Required reads (from SKILL.md Bundled Resources)

1. Read \`${h}\` (SKILL.md) before any task actions.
2. Read every bundled resource file listed below (absolute paths):

${c}
${b}`}import Iy from"fs";import mu from"path";var LU=An.create({service:"skillLensAuthorContext"}),mU={...On,enabled:!1};function ky(h){if(h)return h;try{return W_()}catch(f){return LU.warn("Failed to load skill lens config, using fallback",{error:String(f)}),mU}}function NU(h,f,_){if(!ky(_).enabled)return;if(f<=0)return;let c=f-1,b=mu.resolve(mu.normalize(h),`v${c}`),y=Nu(b,c);return Iy.existsSync(y)?y:void 0}function Fu(h,f,_){let n=ky(_);return{skillLensEnabled:n.enabled,priorSkillLensReportPath:NU(h,f,n)}}function Iu(h){if(!(h.skillLensEnabled??ky().enabled))return"";let _=h.priorSkillLensReportPath?.trim();if(!_||!Iy.existsSync(_))return"";try{let n=JSON.parse(Iy.readFileSync(_,"utf-8")),c=(u)=>{if(u==="L1")return 0;if(u==="L2")return 1;if(u==="L3")return 2;return 3},b=n.findings.filter((u)=>!u.passed&&u.severity==="warning").sort((u,U)=>c(u.level)-c(U.level)).slice(0,10);if(b.length===0)return"";let y=b.map((u,U)=>`${U+1}. [${u.ruleId}] ${u.message}`).join(`
`);return`## Prior Skill Lens Findings (from v${n.version})

Read full report at: ${_}

Top warnings to address this iteration:
${y}

`}catch{return""}}var ku=$_,FU=Rb;function q_(h=gy.homedir(),f){if(f?.trim())process.env[Tn]=f.trim();return xn}function pu(h=gy.homedir(),f){if(f?.trim())process.env[Tn]=f.trim();return Z_}function rn(h=gy.homedir(),f){if(f?.trim())process.env[Tn]=f.trim();return X_}function eu(h){let f=h.expectations.length>0?h.expectations.map((U,$)=>`${$+1}. ${U}`).join(`
`):"(no expectations provided)",_=[h.questionId?`- question_id: ${h.questionId}`:void 0,h.comparisonRole?`- comparison_role: ${h.comparisonRole}`:void 0,`- transcript_path: ${h.transcriptPath}`,`- outputs_dir: ${h.outputsDir}`,`- grading_json_path: ${h.gradingJsonPath}`,h.metricsPath?`- metrics_path: ${h.metricsPath}`:void 0,h.timingPath?`- timing_path: ${h.timingPath}`:void 0].filter((U)=>Boolean(U)),n=h.prompt?.trim(),c=n?`## Task Prompt

The executor was given this task for question \`${h.questionId??"unknown"}\`:

\`\`\`
${n}
\`\`\`
`:"",b=h.extEval??[],y=b.length>0?`## External metrics (\`ext_eval\`)

Eval-set configuration (same for all questions; you grade **this** question \xD7 side only):

${pb(b)}

For each entry above:
1. Read the transcript and inspect \`outputs_dir\` to locate the artifact path relevant to that metric.
2. Run \`eval_script\` with environment variables (export before invoking; also pass as argv if the script reads them):
   - \`EVOLVE_WORKTREE\` = \`outputs_dir\`
   - \`EVOLVE_QUESTION_ID\` = question id above
   - \`EVOLVE_ARTIFACT_PATH\` = absolute path to the artifact you selected (required when the script runs)
   - \`EVOLVE_TRANSCRIPT_PATH\` = transcript path above
   - \`EVOLVE_PROJECT_ROOT\` = ${h.projectPath?.trim()?`\`${h.projectPath.trim()}\``:"(use the question project root from context if known)"}
3. Script stdout must be a single token: \`true\`/\`false\` or a finite number (no JSON wrapper).
4. Record one object in \`ext_eval_results\` per configured metric (see agent instructions). On failure use \`unavailable: true\`, \`value_type: "number"\`, \`value: null\` \u2014 do not skip the metric.

`:"",u=b.length>0?"8. Run every configured `ext_eval` script and populate `ext_eval_results`.\n":"";return`## Dynamic Input

You are grading one completed AB-test execution trajectory.

${_.join(`
`)}

${c}${y}## Expectations

${f}

## Instructions

1. Read the transcript at \`transcript_path\` completely.
2. Inspect files under \`outputs_dir\` that are relevant to the expectations.
3. When \`metrics_path\` / \`timing_path\` are provided, read them and include executor metrics/timing in your result.
4. Grade every expectation string above with pass/fail and concrete evidence.
5. Write the final grading JSON object to \`grading_json_path\` on disk (create parent directories if needed).
6. The JSON must follow the schema in your agent instructions (\`expectations[]\` with \`text\`, \`passed\`, \`evidence\`${b.length>0?"; optional `ext_eval_results[]` when configured":""}).
7. Before writing and returning the JSON, make sure it is strict valid JSON: escape any double quotes inside string values as \`\\"\`, or use Chinese quotes like \u300C\u300D/\u300E\u300F when quoting evidence text. Do not put raw unescaped \`"\` characters inside JSON strings.
${u}
After writing the file, return only the same JSON object inside a single \`\`\`json fence with no extra prose.
`}function an(h){if(h.skillVariant==="none")return`${ku}

## Skill Availability

No skill is available for this session.

You must not use, invoke, load, cite, or rely on any skill instructions. Use only your general reasoning and the task prompt below.

## Task Prompt

${h.prompt}
`;if(!h.skillVersionDir||!h.skillPath)throw Error(`Skill path is required for skill variant ${h.skillVariant}`);let f=Su(h.skillVersionDir),_=Lu(h.skillPath,f);return`${ku}

## Skill Availability

Use the skill version located at this absolute directory:

${h.skillVersionDir}

The active skill file is at this absolute path:

${h.skillPath}

Before doing any task actions, you MUST read this \`SKILL.md\` file directly from disk and follow it during execution.

${_}

## Task Prompt

${h.prompt}

## Execution Notes

- Follow the skill instructions loaded from the SKILL.md path and any required bundled resources above.
- Do not mention evaluation setup, comparison setup, or hidden variants.
- Complete the task as well as possible.
`}function IU(h){if(h.length===0)return"- No user intentions were provided.";return h.map((f)=>`- ${f}`).join(`
`)}function kU(h,f){if(h.length===0)return`- ${f}`;return h.map((_)=>`- ${_}`).join(`
`)}function gU(h){if(!h||h.length===0)return`
    - ext_eval: (none on disk \u2014 do not add this field)`;return`
    - ext_eval (user-owned \u2014 read for intent only; never write or modify):
${h.map((_)=>`      - metric: ${_.metric}, eval_script: ${_.eval_script}, priority: ${_.priority}`).join(`
`)}`}function PU(h){return`
  - expectations:
    - path: ${h.path}${gU(h.extEval)}`}function lU(h){return`
  - expectations_feedback:
    - path: ${h.path}`}function pU(h){let _=Hu(h,{n:3});if(_.length===0)return`
  - topVersionMetrics (selectTopNVersions n=3): (no versions with metrics yet)`;return`
  - topVersionMetrics (selectTopNVersions n=3):
${_.map((c)=>{if(c.unavailable)return`    - v${c.version}: (metrics unavailable)`;let b=(c.passRate*100).toFixed(1);return`    - v${c.version}: expectationsPassRate=${b}% (${c.expectationsPassed}/${c.expectationsTotal})`}).join(`
`)}`}function eU(h,f){if(h.length===0)return`- ${f}`;return h.map((_)=>{let n=_.description.trim()||"(no description provided)",c=_.expectations?PU(_.expectations):"",b=_.evalSetFeedback?lU(_.evalSetFeedback):"",y=_.source==="evolve"?pU(_.name):"";return`- ${_.name}
  - description: ${n}
  - path: ${_.path}${c}${b}${y}`}).join(`
`)}function V_(h){let f=h.skills??[],_=f.some((U)=>U.evalSetFeedback?.path),n=h.extraContext?.trim()?`
## Additional Context

${h.extraContext.trim()}
`:"",c=h.evolveRootDir?.trim()?`## Evolve Workspace

- evolveRoot: ${h.evolveRootDir}
- skillEvolutionWorkspaceDir: ${gh.join(h.evolveRootDir,"skill_evolution_workspace")}

Use these dynamic paths for workspace creation and output writes. Do not use any hardcoded user home directory.

`:"",y=f.some((U)=>(U.expectations?.extEval?.length??0)>0)?["## Advanced configuration: `ext_eval` (user-owned)","","Some skills list `ext_eval` under **Existing Skills \u2192 expectations**. It defines custom business metrics + eval scripts for Comparator/Grader.","","Business rules (read-only context):","- Custom metrics outrank the default expectations pass-rate lane (priority 50). Higher `priority` wins among custom metrics.","- Scripts score task deliverables; inputs must include at least the artifact path; output must be numeric or boolean.","- Read `ext_eval` to infer user intent when shaping `intention` and questions.","- **Never** add, edit, remove, or reorder `ext_eval` in expectations.json \u2014 the pipeline restores the on-disk value after this step.","- Do not copy `eval_script` paths into question `prompt` text.",""].join(`
`):"",u=_?"## Prior Grader Feedback on the Evaluation Set\n\nSome skills list `evalSetFeedback.path` under **Existing Skills** (rollup from the latest AB test grader). Before merging or editing `expectations.json` for that skill:\n\n1. Read the JSON at `evalSetFeedback.path` (canonical `eval_set_feedback.json` next to `expectations.json`).\n2. For each matching `question_id`, considering if appling actionable `eval_feedback.suggestions` to improve `expected_behavior`, `grading_criteria`, or add missing coverage.\n3. Use the inline `evalSetFeedback.digest` as a quick index; read the file for full detail.\n4. Do **not** copy grader feedback into `expectations.json` as extra top-level or per-question fields.\n\n":"";return`## Dynamic Input

## User Intention

${h.userIntention}

## Projects

${kU(h.projects,"No project paths were provided.")}

## Existing Skills

${eU(f,"No existing skills were found.")}

${y}${u}${c}## Generation Preferences

${n||"No additional context was provided."}

## Required Final Response

After writing the expectations file, return only the resolved target skill name wrapped exactly like this:

<target_skill>skill-name-here</target_skill>

Do not include JSON, markdown fences, or explanatory prose in the final response. The value inside \`<target_skill>\` must exactly match the \`skillName\` written to \`expectations.json\`.

When writing \`expectations.json\`, it must be strict valid JSON. Escape any double quotes inside string values as \`\\"\`, or use Chinese quotes like \u300C\u300D/\u300E\u300F inside prompts, expected behaviors, grading criteria, and evidence. Do not write raw examples like \`"prompt": "\u7528\u6237\u8BF4"\u8BA1\u7B97 5 + 3"..."\`; write \`\u7528\u6237\u8BF4\\"\u8BA1\u7B97 5 + 3\\"\` or \`\u7528\u6237\u8BF4\u300C\u8BA1\u7B97 5 + 3\u300D\` instead.
`}function rU(h,f,_=3,n){if(!pn.existsSync(h))return[];let c=n?R(n):void 0,b=[];if(n)b=Dy(n,{n:_}).filter((y)=>y<f);if(b.length===0)b=pn.readdirSync(h,{withFileTypes:!0}).filter((u)=>u.isDirectory()).map((u)=>u.name.match(/^v(\d+)$/)).filter((u)=>Boolean(u)).map((u)=>Number(u[1])).filter((u)=>u<f).filter((u)=>wh(gh.join(h,`v${u}`))).sort((u,U)=>U-u).slice(0,_);return b.filter((y)=>y<f).filter((y)=>wh(gh.join(h,`v${y}`))).slice(0,_).map((y)=>{let u=c?.versions[String(y)];return{version:y,skillPath:gh.join(h,`v${y}`,"SKILL.md"),evidencePath:gh.join(h,`v${y}`,`v${y}_evidence.md`),goodMechanismsPath:u?.success_mechanism,badMechanismsPath:u?.failure_mechanism}})}function gu(h,f){if(!f?.trim())return`  - ${h}: (not recorded in manifest)`;return`  - ${h}: ${f}`}function aU(h){let f=rU(h.skillAuthorWorkingDir,h.version,3,h.skillName);if(f.length===0)return`## Required Historical References

No previous version references were found.
`;let _=f.map((n)=>`- v${n.version}
  - SKILL.md: ${n.skillPath}
  - evidence: ${n.evidencePath}
${gu("good mechanisms (read `success_mechanisms` in analysis.json)",n.goodMechanismsPath)}
${gu("bad mechanisms (read `failure_mechanisms` in analysis.json)",n.badMechanismsPath)}`).join(`
`);return`## Required Historical References

Use at most the following ${f.length} historical samples (highest evaluation performance among prior versions with metrics):

${_}
`}function L_(h){return`## Dynamic Task Context

Skill name: ${h.skillName}
Version: ${h.version}
Skill author working directory: ${h.skillAuthorWorkingDir}

## Required Output Paths

- SKILL.md path: ${h.paths.skillPath}
- Evidence path: ${h.paths.evidencePath}

The targetSkillPath is ${h.targetSkillPath}. It must match the SKILL.md path above.

## User Intentions

${IU(h.intentions)}

${aU(h)}
${Iu(h)}
## Task

Write the evolved skill package into the version package root.
Package root (absolute path): ${gh.dirname(h.paths.skillPath)}

You must write the evolved skill to the SKILL.md path and write the evidence report to the evidence path.
You may also write useful bundled resources under references/, examples/, scripts/, or assets/ inside the package root.
Do not write optional resources unless they are directly useful and referenced from SKILL.md.
Do not write outside the package root.
`}function Pu(h,f,_){if(f===void 0)return"";let n=_==="json"?JSON.stringify(f,null,2):String(f);return`## ${h}

\`\`\`${_}
${n}
\`\`\`

`}function lu(h){if(h.skillVariant==="none")return"not provided";if(!h.skillVersionDir?.trim())return"not provided";let f=h.skillVersionDir.trim(),_=gh.join(f,"SKILL.md");if(pn.existsSync(_))return _;return f}function iU(h){if(h==="B")return"B";return"A"}function Py(h,f){if(!f)return;let _=f.perQuestion.find((u)=>u.questionId===h.question.questionId);if(!_)return;let{winner:n,decisionBasis:c}=Yy(_.baseline,_.treatment,f.extEval),b=h.oldRecord.worktreePath?.trim()||"",y=h.newRecord.worktreePath?.trim()||"";return{comparatorResultPath:f.resultPath,questionWinner:n,questionDecisionBasis:c,sideAWorktreePath:b,sideBWorktreePath:y,sideAGradingPath:b?gh.join(b,"grading","grading.json"):"",sideBGradingPath:y?gh.join(y,"grading","grading.json"):""}}function of(h,f,_){return en(h,f)}function tn(h,f,_){let n=f.comparator,c=iU(n?.questionWinner),b=_,y=n?.comparatorResultPath??gh.join(Tf(h),"ab_comparator_result.json"),u={label:"A (baseline)",skillPath:lu(f.oldRecord),transcriptPath:f.oldTranscriptPath,metricsPath:f.oldMetricsPath,worktreePath:f.oldRecord.worktreePath||"not provided",sessionId:f.oldRecord.sessionId},U={label:"B (treatment)",skillPath:lu(f.newRecord),transcriptPath:f.newTranscriptPath,metricsPath:f.newMetricsPath,worktreePath:f.newRecord.worktreePath||"not provided",sessionId:f.newRecord.sessionId},$=c==="A"?u:U,j=c==="A"?U:u;return`${u_}

---

# Current Post-hoc Task

Analyze exactly one question after blind A/B comparison. Use the \`read\` tool for every path below, then \`write\` the JSON result once to \`output_path\`. Do not analyze other questions.

## Question Context

- question_id: ${f.question.questionId}
- intention: ${f.question.intention}
- project_path: ${f.question.projectPath}

## User Prompt

\`\`\`text
${f.question.prompt}
\`\`\`

## Expected Behavior

\`\`\`text
${f.question.expectedBehavior}
\`\`\`

${Pu("Grading Criteria",f.question.gradingCriteria,"text")}${Pu("Automated Checks",f.question.automatedChecks,"json")}## Post-hoc Parameters

- winner: ${c}
- winner_skill_path: ${$.skillPath}
- winner_transcript_path: ${$.transcriptPath}
- loser_skill_path: ${j.skillPath}
- loser_transcript_path: ${j.transcriptPath}
- comparison_result_path: ${y}
- output_path: ${b}
${n?`- question_decision_basis: ${n.questionDecisionBasis}`:""}
${n?.questionWinner==="tie"?"- note: blind comparator tied on metrics; treat side A as nominal winner for reporting but mention the tie in comparator_reasoning.":""}

## Side A (baseline)

- session_id: ${u.sessionId}
- skill_path: ${u.skillPath}
- worktree_path: ${u.worktreePath}
- transcript_path: ${u.transcriptPath}
- metrics_path: ${u.metricsPath}
${n?.sideAGradingPath?`- grading_path: ${n.sideAGradingPath}`:""}

## Side B (treatment)

- session_id: ${U.sessionId}
- skill_path: ${U.skillPath}
- worktree_path: ${U.worktreePath}
- transcript_path: ${U.transcriptPath}
- metrics_path: ${U.metricsPath}
${n?.sideBGradingPath?`- grading_path: ${n.sideBGradingPath}`:""}

## Required Reads

1. comparison_result_path
2. winner_transcript_path and loser_transcript_path
3. winner_skill_path and loser_skill_path (read SKILL.md)
4. Both metrics_path files (error/recovery and efficiency evidence)
5. grading_path for each side when not empty

## Output

Write one JSON object to:

  ${b}

Follow the **Output Format** in the agent instructions above. Do not print the JSON in chat. Do not write any other files. Reply with at most one short confirmation line after \`write\` succeeds.
`}function ly(h){let f=h.questionResults.map((c)=>`- ${c.questionId}: ${c.analysisPath} (bytes=${c.analysisFileBytes})`).join(`
`),_=h.previousEvidencePath?.trim()?h.previousEvidencePath:"none",n=h.version;return`${FU}

## Version Metadata

- skill_name: ${h.skillName}
- current_version: v${h.version}
- previous_version: ${h.previousVersion===void 0?"none":`v${h.previousVersion}`}
- version_dir: ${h.versionDir}
- history_path: ${h.historyPath}
- skill_path: ${h.skillPath}
- evidence_path: ${h.evidencePath}
- previous_evidence_path: ${_}
- history_document_role: ${h.historyPath} is the skill-level history document; each version must append a section with Key Updates and Evaluation Metrics.
- evidence_document_role: ${h.evidencePath} is the current-version evaluation evidence; append a structured Step 6 summary using the Output formats from the Summary Writer instructions.

## Per-question Analyzer JSON Paths

You MUST use the \`read\` tool to read each file from disk in order. These files are the only source of per-question truth (content is not inlined here).

${f||"- (no questions)"}

## Output Targets (append only)

- history_path: ${h.historyPath}
- evidence_path: ${h.evidencePath}
- previous_evidence_path: ${_} (read for version comparison when not "none")

## Required Outputs

Use the **Output formats** defined in the Summary Writer instructions above. The dynamic values for this run are:

- Replace \`vK\` with \`v${n}\`.
- Replace \`vK-1\` with ${h.previousVersion===void 0?"`-` because this is the baseline version":`\`v${h.previousVersion}\``}.
- Replace \`<skill_name>\` with \`${h.skillName}\`.
- Replace \`<previous_version or none>\` with \`${h.previousVersion===void 0?"none":`v${h.previousVersion}`}\`.

1) Append to \`${h.evidencePath}\` one evidence block using the evidence append format from the instructions. The exact marker pair for this run is:

- \`<<<EVOLVE_V3_SUMMARY_BEGIN v${n}>>>\`
- \`<<<EVOLVE_V3_SUMMARY_END v${n}>>>\`

Use \`read\` on each per-question path first, and \`read\` on \`previous_evidence_path\` when it is not "none". Do not write link-only sections; you must copy numeric tables, causal findings, anomaly notes, and prioritized suggestions into the evidence file.

2) Append to \`${h.historyPath}\` one history section using the history append format from the instructions. Include **Key Updates**, **Top Findings**, and the seven-row **Evaluation Metrics** table. Do not delete or replace existing version sections.

3) If the evidence file already contains the marker pair above, do not write again; report a short conflict message instead.

If baseline (no previous_evidence_path), use \`-\` for baseline and Delta columns.

## Final instruction

Use editor/write tools only for file writes. After both files are appended successfully, reply with at most one short confirmation line.
`}function l6(h,f){let _=f.map((n)=>`| ${n.ruleId} | ${(n.severity??"error").replace(/\|/g,"\\|")} | ${n.message.replace(/\|/g,"\\|")} | ${(n.fixHint??"").replace(/\|/g,"\\|")}${n.location?.file?` (file: ${n.location.file.replace(/\|/g,"\\|")})`:""} |`).join(`
`);return`${L_(h)}
 
## Skill Lens Findings (must fix before AB)
 
The following issues were detected. Fix ALL error and warning items across the full skill package (SKILL.md, scripts/, references/, examples/).
Do not change version number or output paths.
 
| Rule | Severity | Message | Fix hint |
|------|----------|---------|----------|
${_}
`}function tU(h,f){let _=h.split(`
`);if(_.length<=f)return{result:h,total:_.length,truncated:!1};return{result:_.slice(0,f).join(`
`),total:_.length,truncated:!0}}function oU(h){if(!h)return"";if(typeof h==="string")return h;return JSON.stringify(h,null,2)}function sU(h){if(h.type==="text"&&!h.synthetic)return`${h.text}

`;if(h.type==="reasoning"){if(!h.text)return"";return`_Thinking:_

${h.text}

`}if(h.type==="tool"&&h.state){let f=h.tool??"unknown",_=`**Tool: ${f}**
`;if(h.state.input)_+=`
**Input:**
\`\`\`json
${oU(h.state.input)}
\`\`\`
`;if(h.state.status==="completed"&&h.state.output)if(f==="read"){let c=tU(h.state.output,50);_+=`
**Output${c.truncated?` (truncated to 50 lines, ${c.total} total)`:""}:**
\`\`\`
${c.result}
\`\`\`
`}else _+=`
**Output:**
\`\`\`
${h.state.output}
\`\`\`
`;if(h.state.status==="error"&&h.state.error)_+=`
**Error:**
\`\`\`
${h.state.error}
\`\`\`
`;return _+=`
`,_}if(h.type==="patch"){let f=`**Patch**
`;if(h.files&&h.files.length>0)f+=`Files: ${h.files.join(", ")}
`;if(h.hash)f+=`Hash: ${h.hash}
`;return f+=`
`,f}return""}function hj(h){let f=[];if(h.agent)f.push(h.agent);if(h.modelID)f.push(h.modelID);if(h.time?.completed&&h.time?.created){let n=((h.time.completed-h.time.created)/1000).toFixed(1);f.push(`${n}s`)}if(h.cost!==void 0)f.push(`$${h.cost.toFixed(4)}`);return`## Assistant${f.length>0?` (${f.join(" \xB7 ")})`:""}

`}function fj(h){let f="";if(h.info.role==="user")f+=`## User

`;else f+=hj(h.info);for(let _ of h.parts)f+=sU(_);return f}function m_(h){let f=`# ${h.title}

`;if(f+=`**Session ID:** ${h.id}
`,f+=`**Created:** ${new Date(h.time.created).toLocaleString()}
`,f+=`**Updated:** ${new Date(h.time.updated).toLocaleString()}
`,h.directory)f+=`**Directory:** ${h.directory}
`;if(h.summary)f+=`**Summary:** +${h.summary.additions} -${h.summary.deletions} in ${h.summary.files} files
`;f+=`
---

`;for(let _ of h.messages)f+=fj(_),f+=`---

`;return f}var{spawn:cj}=globalThis.Bun;if(process.env.IS_PROD!=="true")process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";var py={inferhubBaseUrl:"http://snapengine.codemate.cce.prod-kwe-g.dragon.tools.huawei.com/api/v2/",env:"prod"};async function au(h,f){let _=await fetch("https://rnd-idea-api.huawei.com/ideaclientservice/login/v4/secureLogin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:h,password:f})});if(!_.ok)throw Error(`Auth failed: ${_.status} ${_.statusText}`);let n=await _.json();if(n.status!=="success"||!n.cloudDragonTokens?.authToken)throw Error(`Auth failed: status=${n.status}`);return{token:n.cloudDragonTokens.authToken,refreshToken:n.cloudDragonTokens.refreshToken,userName:h,expiresAt:Date.now()+86400000}}async function nj(h){let f=await fetch("https://rnd-idea-api.huawei.com/ideaclientservice/login/v5/refreshToken",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:h})});if(!f.ok)throw Error(`Refresh failed: ${f.status} ${f.statusText}`);let _=await f.json();if(_.status!=="success"||!_.cloudDragonTokens?.authToken)throw Error(`Refresh failed: status=${_.status}`);return{token:_.cloudDragonTokens.authToken,refreshToken:_.cloudDragonTokens.refreshToken,userName:"",expiresAt:Date.now()+86400000}}function iu(h,f,_,n=10){let c=n*60*1000,b=setInterval(async()=>{try{let y=h();if(y.expiresAt-Date.now()<c){console.log("[auth] Token expiring soon, refreshing...");let U=await nj(y.refreshToken);U.userName=y.userName,f(U),await _(U.token),console.log("[auth] Token refreshed successfully")}}catch(y){console.error("[auth] Token refresh failed:",y)}},c);return()=>clearInterval(b)}var tu=1e4,_0={info:(h)=>{},error:(h)=>{}};async function n0(h){let f=h.logger||_0,_=h.projectDir,n=h.xdgDataHome||"",c={...process.env,OPENCODE_EVOLVE_SKIP_PLUGIN:"1"},b=h.xdgDataHome?{...c,XDG_DATA_HOME:h.xdgDataHome}:c;if(f.info(`[evolve] Using webserver: ${h.webserverPath}`),f.info(`[evolve] Starting opencode webserver in: ${_}`),h.xdgDataHome)f.info(`[evolve] XDG_DATA_HOME: ${h.xdgDataHome}`);if(h.mode)f.info(`[evolve] Execution mode: ${h.mode.type}`);if(!h.webserverPath)throw Error("webserverPath is required");let y=[h.webserverPath,"serve","--hostname=127.0.0.1","--port=0"],u=h.mode?h0(h.mode,h.projectDir):[],U=[...y,...u],$=h.mode?f0(h.mode,n):{},j={...b,...$};try{let J=cj({cmd:U,cwd:_,env:j,stdin:"ignore",stdout:"pipe",stderr:"pipe",windowsHide:!0}),K=await new Promise((Z,z)=>{let W=setTimeout(()=>{J.kill(),z(Error(`Timeout waiting for webserver to start after ${tu}ms`))},tu),w=new AbortController,v="";if(J.stdout){let X=J.stdout.getReader(),Q=new TextDecoder;(async()=>{try{while(!w.signal.aborted){let{done:B,value:N}=await X.read();if(B)break;let A=Q.decode(N,{stream:!0});v+=A;let S=v.split(`
`);for(let E of S)if(E.includes("server listening")){let F=E.match(/on\s+(https?:\/\/[^\s]+)/);if(F){clearTimeout(W),w.abort(),Z(F[1]),X.releaseLock();return}}}}catch(B){if(w.signal.aborted)return;clearTimeout(W),z(B)}})().catch(z)}if(J.stderr){let X=J.stderr.getReader(),Q=new TextDecoder;(async()=>{try{while(!w.signal.aborted){let{done:B,value:N}=await X.read();if(B)break;let A=Q.decode(N,{stream:!0});v+=A}}catch(B){if(w.signal.aborted)return;clearTimeout(W),z(B)}})().catch(z)}J.exited.then((X)=>{clearTimeout(W);let Q=`webserver exited with code ${X}`;if(v.trim())Q+=`
Server output: ${v}`;z(Error(Q))}).catch((X)=>{clearTimeout(W),z(X)})});return{client:ou({baseUrl:K,directory:_}),url:K,async close(){J.kill(),await J.exited}}}catch(J){throw J}}async function ey(h){if(h.mode?.type==="codemate"&&h.auth&&h.modelConfig)return bj({...h,auth:h.auth,modelConfig:h.modelConfig});return yj(h)}async function yj(h){return n0(h)}async function bj(h){let f=h.logger||_0,_=process.env.CODEMATE_ACCOUNT,n=process.env.CODEMATE_PASSWORD;if(!_||!n)throw Error("CODEMATE_ACCOUNT and CODEMATE_PASSWORD env vars required");f.info("[evolve] Logging in to CloudDragon...");let c=await au(_,n);f.info("[evolve] Login successful");let b=await n0(h);f.info("[evolve] Initializing webserver with token...");let y=await fetch(`${b.url}/v1/init`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({targetDir:h.projectDir,env:"clouddragon",language:"zh-cn",token:c.token,userName:_,inferhubBaseUrl:h.auth.inferhubBaseUrl})});if(!y.ok){let j=await y.text().catch(()=>"");throw Error(`Webserver /v1/init failed: status=${y.status} body=${j.slice(0,500)}`)}f.info("[evolve] Webserver initialized"),f.info("[evolve] Configuring provider...");let u=await fetch(`${b.url}/global/config`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:{[h.modelConfig.providerID]:{name:h.modelConfig.providerID,npm:"@ai-sdk/github-copilot",models:{[h.modelConfig.modelID]:{id:h.modelConfig.modelID,limit:{output:8192,context:128000}}}}}})});if(!u.ok){let j=await u.text().catch(()=>"");throw Error(`Provider config failed: status=${u.status} body=${j.slice(0,500)}`)}f.info("[evolve] Provider configured");let U=c,$=iu(()=>U,(j)=>{U=j},async(j)=>{await fetch(`${b.url}/v1/config`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({userToken:j})})},10);return{...b,auth:U,stopRefresh:$,async close(){$(),await b.close()}}}import Oh from"fs";import jj from"os";function on(h){if(!Number.isInteger(h)||h<=0)return!1;try{return process.kill(h,0),!0}catch(f){let _=f&&typeof f==="object"&&"code"in f?String(f.code):"";if(_==="ESRCH")return!1;if(_==="EPERM")return!0;return!1}}var ry=1;var y0=3600000,b0=3600000,ay=1800000,sn=3,u0=[50,100,200];function iy(){return process.pid}function ty(h=iy()){return`daemon:${h}`}class Ph extends Error{holder;constructor(h){super(Uj(h));this.name="SkillEvolutionLockHeldError",this.holder=h}}class N_ extends Error{constructor(h,f){super(`Skill evolution lock lost for "${h}" (expected generation ${f}); another process may have taken over`);this.name="SkillEvolutionLockLostError"}}function Uj(h){let f=[`Skill "${h.skillName}" is already evolving`,`owner=${h.ownerKind}`,`pid=${h.ownerPid}`,`session=${h.ownerSessionId}`,`since=${h.acquiredAt}`];if(h.requestLogPath)f.push(`log=${h.requestLogPath}`);return`${f.join(", ")}. This request was stopped and will not write SKILL or expectations.`}var sy=new Map;function h3(h){return sy.get(h.trim())}function $0(h){sy.set(h.skillName.trim(),h)}function j0(h){sy.delete(h.trim())}function Y0(){return new Date().toISOString()}function J0(h){return new Date(Date.now()+h).toISOString()}function f3(h,f){return h.ownerPid===f.ownerPid&&h.ownerKind===f.ownerKind&&h.ownerSessionId===f.ownerSessionId}async function Yj(h){if(h<=0)return;await new Promise((f)=>setTimeout(f,h))}function Jj(h,f){if(h.schemaVersion!==ry)return null;if(typeof h.skillName!=="string"||h.skillName.trim()!==f)return null;if(typeof h.lockGeneration!=="number"||!Number.isInteger(h.lockGeneration)||h.lockGeneration<1)return null;if(typeof h.ownerPid!=="number"||!Number.isInteger(h.ownerPid)||h.ownerPid<=0)return null;if(h.ownerKind!=="frontend"&&h.ownerKind!=="daemon")return null;if(typeof h.ownerSessionId!=="string"||!h.ownerSessionId.trim())return null;if(typeof h.acquiredAt!=="string"||!h.acquiredAt.trim())return null;if(typeof h.renewedAt!=="string"||!h.renewedAt.trim())return null;if(typeof h.leaseExpiresAt!=="string"||!h.leaseExpiresAt.trim())return null;return h}function sf(h,f){if(!Oh.existsSync(h))return null;try{let _=JSON.parse(Oh.readFileSync(h,"utf-8"));return Jj(_,f)}catch{return null}}function oy(h,f){if(!h)return!0;if(h.skillName!==f)return!0;if(Date.now()>=Date.parse(h.leaseExpiresAt))return!0;if(!on(h.ownerPid))return!0;return!1}function Kj(h,f){let _=`${h}.tmp`;Oh.writeFileSync(_,`${JSON.stringify(f,null,2)}
`,"utf-8"),Oh.renameSync(_,h)}function Gj(h,f,_){let n=Y0();return{schemaVersion:ry,skillName:h,lockGeneration:_,ownerPid:f.ownerPid,ownerKind:f.ownerKind,ownerSessionId:f.ownerSessionId,acquiredAt:n,renewedAt:n,leaseExpiresAt:J0(y0),...f.requestLogPath?{requestLogPath:f.requestLogPath}:{},pipelinePhase:"step1",ownerHost:jj.hostname()}}function U0(h,f,_,n){let c;try{c=Oh.openSync(h,"wx");let b=Gj(f,_,n);return Oh.writeFileSync(c,`${JSON.stringify(b,null,2)}
`,"utf-8"),b}catch(b){if((b&&typeof b==="object"&&"code"in b?String(b.code):"")==="EEXIST")return null;throw b}finally{if(c!==void 0)Oh.closeSync(c)}}function Wj(h){if(!h||!Number.isInteger(h.lockGeneration))return 1;return h.lockGeneration+1}async function K0(h,f){let _=h.trim(),n=f.requestLogPath;Y(`[evolution-lock] acquire enter skill=${_} owner=${f.ownerKind} pid=${f.ownerPid} session=${f.ownerSessionId}`,n);try{hc(_)}catch(U){let $=U instanceof Error?U.message:String(U);return Y(`[evolution-lock] acquire rejected skill=${_}: invalid_skill_name (${$})`,n),{ok:!1,reason:"invalid_skill_name",message:$}}let c=h3(_);if(c&&f3(c.owner,f)){let U=F_(_),$=sf(U,_);if($&&$.lockGeneration===c.lockGeneration)return Y(`[evolution-lock] acquire idempotent ok skill=${_} generation=${$.lockGeneration}`,n),{ok:!0,lock:$,lockGeneration:$.lockGeneration};Y(`[evolution-lock] acquire in-memory holder stale skill=${_} heldGeneration=${c.lockGeneration} onDiskGeneration=${$?.lockGeneration??"missing"}; re-acquiring`,n)}let b=nh(_);Oh.mkdirSync(b,{recursive:!0});let y=F_(_);Y(`[evolution-lock] acquire lockPath=${y}`,n);for(let U=0;U<sn;U++){if(U>0){let K=u0[U-1]??100;Y(`[evolution-lock] acquire retry skill=${_} attempt=${U+1}/${sn} afterMs=${K}`,n),await Yj(K)}else Y(`[evolution-lock] acquire attempt skill=${_} attempt=${U+1}/${sn}`,n);if(!Oh.existsSync(y)){Y(`[evolution-lock] acquire wx create skill=${_} generation=1 (no lock file)`,n);let K=U0(y,_,f,1);if(K)return $0({skillName:_,lockGeneration:K.lockGeneration,owner:f}),Y(`[evolution-lock] acquired skill=${_} generation=${K.lockGeneration} session=${f.ownerSessionId} leaseExpiresAt=${K.leaseExpiresAt}`,n),{ok:!0,lock:K,lockGeneration:K.lockGeneration};Y(`[evolution-lock] acquire wx race skill=${_} generation=1 (EEXIST); will retry`,n);continue}let $=sf(y,_);if(!oy($,_))return Y(`[evolution-lock] acquire held skill=${_} holderPid=${$.ownerPid} holderKind=${$.ownerKind} holderSession=${$.ownerSessionId} generation=${$.lockGeneration} leaseExpiresAt=${$.leaseExpiresAt}`,n),{ok:!1,reason:"held",holder:$};Y(`[evolution-lock] acquire stale takeover skill=${_} previousGeneration=${$?.lockGeneration??"none"} previousPid=${$?.ownerPid??"none"} leaseExpiresAt=${$?.leaseExpiresAt??"none"}`,n);try{Oh.unlinkSync(y),Y(`[evolution-lock] acquire unlinked stale lock skill=${_}`,n)}catch(K){let G=K instanceof Error?K.message:String(K);return Y(`[evolution-lock] acquire unlink failed skill=${_}: ${G}`,n),{ok:!1,reason:"io_error",message:G}}let j=Wj($);Y(`[evolution-lock] acquire wx create skill=${_} generation=${j} (after stale unlink)`,n);let J=U0(y,_,f,j);if(J)return $0({skillName:_,lockGeneration:J.lockGeneration,owner:f}),Y(`[evolution-lock] acquired (stale takeover) skill=${_} generation=${J.lockGeneration} session=${f.ownerSessionId} leaseExpiresAt=${J.leaseExpiresAt}`,n),{ok:!0,lock:J,lockGeneration:J.lockGeneration};Y(`[evolution-lock] acquire wx race skill=${_} generation=${j} (EEXIST after stale unlink); will retry`,n)}let u=sf(y,_);if(u&&!oy(u,_))return Y(`[evolution-lock] acquire failed held after retries skill=${_} holderPid=${u.ownerPid} generation=${u.lockGeneration}`,n),{ok:!1,reason:"held",holder:u};return Y(`[evolution-lock] acquire failed io_error after retries skill=${_}`,n),{ok:!1,reason:"io_error",message:`Failed to acquire skill evolution lock for "${_}" after retries`}}async function fc(h,f){let _=await K0(h,f);if(!_.ok){if(_.reason==="held")throw Y(`[evolution-lock] assert acquire failed held skill=${h.trim()} holderPid=${_.holder.ownerPid} holderSession=${_.holder.ownerSessionId}`,f.requestLogPath),new Ph(_.holder);throw Y(`[evolution-lock] assert acquire failed skill=${h.trim()} reason=${_.reason} message=${_.message}`,f.requestLogPath),Error(_.message)}return _.lock}function G0(h,f,_={}){let n=h.trim(),c=f.requestLogPath;Y(`[evolution-lock] renew enter skill=${n} owner=${f.ownerKind} pid=${f.ownerPid} session=${f.ownerSessionId} force=${_.force===!0} phase=${_.pipelinePhase??"none"}`,c);let b=h3(n);if(!b||!f3(b.owner,f))throw Y(`[evolution-lock] renew rejected skill=${n}: in-memory holder mismatch (hasHeld=${Boolean(b)} heldSkill=${b?.skillName??"none"} heldGeneration=${b?.lockGeneration??"none"})`,c),new N_(n,b?.lockGeneration??-1);Y(`[evolution-lock] renew in-memory ok skill=${n} generation=${b.lockGeneration}`,c);let y=F_(n),u=sf(y,n);if(!u||u.lockGeneration!==b.lockGeneration){let j=b.lockGeneration,J=u?.lockGeneration??"missing";throw Y(`[evolution-lock] renew rejected skill=${n}: disk generation mismatch (expected=${j} onDisk=${J} lockPath=${y})`,c),j0(n),new N_(n,j)}Y(`[evolution-lock] renew disk ok skill=${n} generation=${u.lockGeneration} leaseExpiresAt=${u.leaseExpiresAt} phase=${u.pipelinePhase??"none"}`,c);let U=Date.parse(u.leaseExpiresAt)-Date.now();if(!_.force&&U>=ay){Y(`[evolution-lock] renew skipped skill=${n}: remainingLeaseMs=${U} thresholdMs=${ay} (not forced)`,c);return}let $={...u,renewedAt:Y0(),leaseExpiresAt:J0(b0),..._.pipelinePhase?{pipelinePhase:_.pipelinePhase}:{},...f.requestLogPath?{requestLogPath:f.requestLogPath}:{}};Kj(y,$),Y(`[evolution-lock] renewed skill=${n} generation=${$.lockGeneration} phase=${$.pipelinePhase??"unchanged"} leaseExpiresAt=${$.leaseExpiresAt}`,c)}function _3(h,f,_){G0(h,f,{force:!0,pipelinePhase:_})}function _c(h,f){let _=h.trim(),n=h3(_);if(!n||!f3(n.owner,f))return;let c=F_(_),b=sf(c,_);if(b&&b.lockGeneration===n.lockGeneration&&b.ownerPid===f.ownerPid)try{if(Oh.existsSync(c))Oh.unlinkSync(c);Y(`[evolution-lock] released skill=${_} generation=${b.lockGeneration}`,f.requestLogPath)}catch(y){Y(`[evolution-lock] release failed skill=${_}: ${y instanceof Error?y.message:String(y)}`,f.requestLogPath)}j0(_)}class I_ extends Error{holder;constructor(h){super(W0(h));this.name="SessionEvolutionGateBusyError",this.holder=h}}function W0(h){return`This OpenCode session already has a skill-evolver run in progress${h.skillName?` (skill=${h.skillName})`:""} since ${h.startedAt}. Wait for it to finish before starting another. Other sessions are not affected.`}var xf=new Map;function k_(h){let f=h.trim();if(!f)throw Error("sessionId must be non-empty to start skill-evolver");let _=xf.get(f);if(_&&on(_.ownerPid))throw new I_(_);if(_)xf.delete(f);xf.set(f,{ownerPid:process.pid,ownerSessionId:f,startedAt:new Date().toISOString()})}function Z0(h,f){let _=h.trim(),n=xf.get(_);if(!n||n.ownerPid!==process.pid)return;n.skillName=f.trim(),xf.set(_,n)}function h_(h){let f=h.trim();if(!f)return;let _=xf.get(f);if(!_||_.ownerPid!==process.pid)return;xf.delete(f)}import r0 from"fs";import GY from"os";import WY from"path";import Cf from"fs";import f_ from"path";import Zj from"os";function X0(h,f){let _=f.trim().toLowerCase();if(!_)return null;let n=h.filter((u)=>u.source==="evolve"&&Pn(u.name));if(n.length===0)return null;let c=n.filter((u)=>_.includes(u.name.trim().toLowerCase()));if(c.length!==1)return null;let b=c[0],y=R(b.name);return{skillName:b.name,evalSetVersion:y.evalSets.currentVersion}}function nc(h){if(typeof h==="string")return h;if(!h||typeof h!=="object")return"";let f=h;if(f.error)throw Error(`expectations-generator prompt failed: ${JSON.stringify(f.error)}`);let _=f.data?.parts;if(!Array.isArray(_))return JSON.stringify(h);return _.filter((n)=>n?.type==="text"&&typeof n.text==="string").map((n)=>n.text).join(`
`).trim()}function Xj(h){let f=nc(h),_=f.match(/<target_skill>\s*([^<]+?)\s*<\/target_skill>/i);if(!_?.[1]?.trim())throw Error(`expectations-generator response missing <target_skill> tag: ${f.slice(0,500)}`);return _[1].trim()}function z0(h,f){let _=h.trim();if(!_)throw Error("validateExpectationsWorkspaceAfterStep1: targetSkill must be non-empty");let n=f_.join(f,"skill_evolution_workspace",`${_}_evolution_space`),c=f_.join(n,"expectations.json"),b=Kf(c);if(b.skillName&&b.skillName.trim()!==_)throw Error(`expectations.json skillName "${b.skillName}" does not match Step1 <target_skill> "${_}"`);if(!b.isNew)return;if(!Cf.existsSync(n))throw Error(`Step1 validation failed (isNew=true): skill evolution directory missing: ${n}`);if(!Cf.statSync(n).isDirectory())throw Error(`Step1 validation failed (isNew=true): path exists but is not a directory: ${n}`);if(!Cf.readFileSync(c,"utf-8").trim())throw Error(`Step1 validation failed (isNew=true): expectations.json is empty: ${c}`)}function n3(h,f,_,n){let c=h.trim(),b=f_.join(f,"skill_evolution_workspace",`${c}_evolution_space`,"expectations.json"),y=Kf(b);return af(b,{skillName:c,isNew:y.isNew,projectDir:_,homeDir:n})}async function w0(h,f,_,n,c,b={}){let y=(u)=>Y(u,c);y(`[evolve-v3][frontend][expectations-gen] ========== Stage start ========== userIntention=${f?.user_intention??"not provided"}, projectPath=${n}, evolveRoot=${I()}`),y(`[evolve-v3][frontend][expectations-gen] Entry context:
${Jh({sessionID:_.sessionID,extraContext:_?.extraContext,user_intention:f?.user_intention,projectPath:n,evolveRoot:I()})}`);try{let u=_.userHomeDir,U=_.directory||n;q_(u,U);let $=u?.trim()||Zj.homedir(),j=U?.trim()||process.cwd();y(`[evolve-v3][frontend][expectations-gen] Agent ensured (userHomeDir=${$}, projectDir=${j})`),y("[evolve-v3][frontend][expectations-gen] Collecting local skills");let J={mode:"opencode",projectDir:j,evolveRootDir:I(),homeDir:$},K=Ln(J),G=K.map((A)=>({name:A.name,path:A.path,hasExpectationsSummary:Boolean(A.expectations),expectationsQuestionCount:A.expectations?.questionCount,expectationsPath:A.expectations?.path}));y(`[evolve-v3][frontend][expectations-gen] Skills collected, count=${G.length}`),y(`[evolve-v3][frontend][expectations-gen] Skills summary:
${Jh(G)}`);let Z=X0(K,f?.user_intention??"");if(Z){let A=I();if(y(`[AnalyzeReq] Skipping expectations-generator: eval set v${Z.evalSetVersion} is pinned for ${Z.skillName}`),y(`[evolve-v3][frontend][expectations-gen] Pinned eval set skip: skill=${Z.skillName} evalSetVersion=${Z.evalSetVersion}`),b.acquireSkillLockAfterParse)await b.acquireSkillLockAfterParse(Z.skillName);z0(Z.skillName,A);let S=n3(Z.skillName,A,j,$);return y("[AnalyzeReq] ========== User requirements analysis completed (pinned skip) =========="),{targetSkillName:Z.skillName,collectedSkills:K,targetSource:S}}y("[evolve-v3][frontend][expectations-gen] Building prompt context");let z={userIntention:f?.user_intention??"",projects:n?[n]:[],evolveRootDir:I(),userHomeDir:u,skills:K,extraContext:_?.extraContext??""},W=V_(z);y(`[evolve-v3][frontend][expectations-gen] Prompt built (${W.length} chars, skills=${K.length})`),y("[evolve-v3][frontend][expectations-gen] Sending prompt to AI session");let w=Ih({maxAttempts:1,exhaustedDecision:"fail",name:"step1_single_attempt"}),v=3,X=0,Q=0,d=Date.now(),B=Cu();y(`[evolve-v3][frontend][expectations-gen] Snapshotted expectations.json for ${B.size} evolution space(s)`);let N=hf(_?.model);while(X<v){let A=await Mh({...dh(h,{targetShape:"plugin"}),stage:"expectations-gen",policy:w,createSession:async()=>{let D=Tb(),x=[...new Set([j,...z.projects,...tc(j,$)].map((g)=>f_.resolve(g)))],V=await h.session.create({body:Xh({allowedRoots:D,readOnlyRoots:x})});return zh(V,D,{readOnlyRoots:x})},runPrompt:async(D,x)=>{return y(`[evolve-v3][frontend][expectations-gen] AI session created, sessionId=${D}`),h.session.prompt({path:{id:D},body:{agent:xn,parts:[{type:"text",text:W}],tools:{question:!1},...N?{model:{providerID:N.providerID,modelID:N.modelID}}:{}}},{signal:x})},promptTimeoutMs:3600000,logContext:c});if(Q+=A.attempts,!A.ok)throw Error(`Step1 expectations-generator session failed: status=${A.status}, reason=${A.reason}, message=${A.errorMessage}`);let S=A.value;y(`[evolve-v3][frontend][expectations-gen] AI response received, responseType=${typeof S}`);let E;try{E=Xj(S)}catch(D){X++;let x=D instanceof Error?D.message:String(D),V="";try{V=nc(S).slice(0,500)}catch{V=JSON.stringify(S).slice(0,500)}if(X>=v)throw y(`[evolve-v3][frontend][expectations-gen] validator_failed stage=expectations-gen targetSkillRetryAttempt=${X}/${v} sessionId=${A.sessionId} reason=invalid_output_schema message=${x} messagePreview=${V} decision=fail`),Error(`Step1 expectations-generator validation failed: ${x}`);y(`[evolve-v3][frontend][expectations-gen] validator_retry stage=expectations-gen targetSkillRetryAttempt=${X}/${v} sessionId=${A.sessionId} reason=invalid_output_schema message=${x} messagePreview=${V} decision=retry`);continue}y(`[evolve-v3][frontend][expectations-gen] Target skill parsed: ${E}, session=${A.sessionId}`);let F=I();if(b.acquireSkillLockAfterParse)await b.acquireSkillLockAfterParse(E);z0(E,F);let O=E.trim(),q=f_.join(F,"skill_evolution_workspace",`${O}_evolution_space`,"expectations.json"),m=B.get(O),P=m?A_(m):{kind:"absent"};if(T_(q,P),y(`[evolve-v3][frontend][expectations-gen] Restored user-owned ext_eval (${P.kind==="present"?P.entries.length:"absent"}) on ${q}`),Pn(O)){let D=R(O).evalSets.currentVersion,x=B.get(O);if(x)Cf.writeFileSync(q,x.trimEnd().endsWith(`
`)?x.trimEnd():`${x.trimEnd()}
`,"utf-8"),T_(q,A_(x));y(`[evolve-v3][frontend][expectations-gen] Target skill ${O} has pinned eval set v${D}; restored pre-agent expectations and skipped archive`),y("[evolve-v3][frontend][expectations-gen] ========== Stage completed (pinned) ==========");let V=n3(E,F,j,$);return{targetSkillName:E,collectedSkills:K,targetSource:V}}let H=Kf(q),C=Cf.readFileSync(q,"utf-8"),T=ln(O,{expectations:H.expectations,previousExpectationsJson:B.get(O),writtenExpectationsJson:C},{requestLogFilePath:c});y(`[evolve-v3][frontend][expectations-gen] Eval set sync: currentVersion=${T.evalSets.currentVersion}, questionCount=${H.expectations.length}`),y(`[evolve-v3][frontend][expectations-gen] Persistence validation passed: ${f_.join(F,"skill_evolution_workspace",`${O}_evolution_space`)}`),y(`[evolve-v3][frontend][expectations-gen] Validator final: finalStatus=success targetSkillName=${E} watchdogAttempts=${Q} targetSkillRetryAttempts=${X} elapsedMs=${Date.now()-d}`),y("[evolve-v3][frontend][expectations-gen] ========== Stage completed ==========");let M=n3(E,F,j,$);return{targetSkillName:E,collectedSkills:K,targetSource:M}}throw Error(`Step1 expectations-generator <target_skill> parsing exhausted ${v} attempts`)}catch(u){let U=u instanceof Error?u.message:String(u),$=u instanceof Error?u.stack:"";if(y(`[evolve-v3][frontend][expectations-gen] [ERROR] Stage failed: ${U}`),$)y(`[evolve-v3][frontend][expectations-gen] [ERROR] stack: ${$}`);throw u}}import Sh from"path";import*as bh from"fs";import vj from"os";var Q0=!1,c3=3,y3=3;function g_(h){return Math.max(1,Math.floor(h??3))}function P_(h){return Math.max(1,Math.floor(h??3))}class l_{max;active=0;queue=[];constructor(h){this.max=h}async acquire(h){if(this.active<this.max){this.active++;return}let{signal:f,timeoutMs:_}=h??{};await new Promise((n,c)=>{let b={resolve:n,reject:c,signal:f},y;if(f){if(f.aborted){c(Error("EvolveV3Semaphore acquire aborted"));return}let u=()=>{if(b.aborted=!0,y)clearTimeout(y);let U=this.queue.indexOf(b);if(U!==-1)this.queue.splice(U,1);c(Error("EvolveV3Semaphore acquire aborted"))};b.onAbort=u,f.addEventListener("abort",u,{once:!0})}if(_!=null&&_>0)y=setTimeout(()=>{let u=this.queue.indexOf(b);if(u!==-1)this.queue.splice(u,1);if(b.onAbort&&f)f.removeEventListener("abort",b.onAbort);c(Error(`EvolveV3Semaphore acquire timed out after ${_}ms`))},_),b.resolve=()=>{if(clearTimeout(y),b.onAbort&&f)f.removeEventListener("abort",b.onAbort);this.active++,n()};else{let u=n;b.resolve=()=>{if(b.onAbort&&f)f.removeEventListener("abort",b.onAbort);this.active++,u()}}this.queue.push(b)})}release(){if(this.active<=0)return;this.active--;let h=this.queue.shift();while(h&&h.aborted)h=this.queue.shift();if(h)h.resolve()}}import cc from"fs";import yc from"path";function zj(){return new Date().toISOString()}function wj(h){if(!cc.existsSync(h))return{passed:0,total:0};try{let f=JSON.parse(cc.readFileSync(h,"utf-8")),_=Array.isArray(f.expectations)?f.expectations:[];return{passed:_.filter((c)=>c.passed===!0).length,total:_.length}}catch{return{passed:0,total:0}}}function v0(h,f){let _=Q_(f),n=yc.join(f,"grading","grading.json"),c=wj(n);return{comparisonRole:h,gradingPath:yc.resolve(n),expectationsPassed:c.passed,expectationsTotal:c.total,unavailable:_?.unavailable,unavailableReason:_?.reason,eval_feedback:_?.eval_feedback}}function H0(h){ch(h.skillName);let f=R(h.skillName),_=h.questions.map((n)=>({question_id:n.questionId,sides:[v0("baseline",n.worktreePathA),v0("treatment",n.worktreePathB)]}));return{schemaVersion:1,skillName:h.skillName,evalSetVersion:f.evalSets.currentVersion,iterationVersion:h.iterationVersion,updatedAt:zj(),questions:_}}function d0(h,f){let _=pf(h);return cc.mkdirSync(yc.dirname(_),{recursive:!0}),cc.writeFileSync(_,`${JSON.stringify(f,null,2)}
`,"utf-8"),yc.resolve(_)}function b3(h){let f=H0(h),_=d0(h.skillName,f);return xu(h.skillName,f.evalSetVersion,_),{feedbackPath:_,evalSetVersion:f.evalSetVersion}}var u3=60000;function Hj(h,f,_){return{unavailable:!0,reason:f,sessionId:h,..._?{dbPath:_}:{}}}function dj(h,f){return{unavailable:!0,reason:f,sessionId:h,duration_seconds:0,wall_clock_duration_ms:0,session_created_at:"",session_updated_at:"",user_message_count:0,assistant_message_count:0}}function Oj(h){return Qf(Fh(),h)}function Bj(h,f){return{sessionId:h.id,duration_seconds:f.duration,wall_clock_duration_ms:h.time.updated-h.time.created,session_created_at:new Date(h.time.created).toISOString(),session_updated_at:new Date(h.time.updated).toISOString(),user_message_count:f.userMessageCount,assistant_message_count:f.assistantMessageCount}}function Aj(h){if(h.length<=u3)return h;let f=h.slice(0,Math.floor(u3*0.6)),_=h.slice(-Math.floor(u3*0.35));return`${f}

...[transcript truncated for grading prompt]...

${_}`}function Tj(h){let f=[],_=h.expectedBehavior?.trim();if(_)f.push(`Expected behavior: ${_}`);let n=h.gradingCriteria?.trim();if(n)f.push(`Grading criteria: ${n}`);if(h.automatedChecks!==void 0)f.push(`Automated checks: ${JSON.stringify(h.automatedChecks,null,2)}`);return f}function p_(h,f){bh.mkdirSync(Sh.dirname(h),{recursive:!0}),bh.writeFileSync(h,`${JSON.stringify(f,null,2)}
`,"utf-8")}var O0=500,$3=3;function xj(h,f){if(bh.existsSync(h))try{return w_(bh.readFileSync(h,"utf-8"))}catch{}let _=nc(f);if(!_.trim())throw Error("grader response was empty and grading.json was not written");return w_(_)}async function Cj(h,f,_){let n;for(let c=0;c<=$3;c++)try{return xj(h,f)}catch(b){if(n=b,c<$3)_?.(`[evolve-v3][ab] Grader result not ready, retrying in ${O0}ms (attempt ${c+1}/${$3})`),await new Promise((y)=>setTimeout(y,O0))}throw n}async function qj(h,f){let{client:_,context:n,question:c,comparisonRole:b,sessionId:y,worktreePath:u,promptTimeoutMs:U=3600000,continueOnGraderError:$=!0,extEval:j,log:J,logContext:K,waitOptions:G}=h,{transcriptPath:Z,metricsPath:z,timingPath:W,gradingJsonPath:w}=f,v=n?.evolveV3SkipStatusPrompt===!0;if(v&&typeof _?.session?.promptAsync!=="function"){p_(w,kf(y,"session.promptAsync is required for grader in daemon/headless mode",j)),J?.(`[evolve-v3][ab] Grader skipped for session=${y}: session.promptAsync is required for grader in daemon/headless mode`);return}if(!v&&typeof _?.session?.prompt!=="function"){p_(w,kf(y,"session.prompt is required to invoke the grader agent",j)),J?.(`[evolve-v3][ab] Grader skipped for session=${y}: session.prompt is required to invoke the grader agent`);return}let X=n?.userHomeDir?.trim()||vj.homedir(),Q=n?.directory?.trim()||u;pu(X,Q);let d=Tj(c),B=eu({expectations:d,transcriptPath:Z,outputsDir:u,gradingJsonPath:w,metricsPath:z,timingPath:W,questionId:c.questionId,comparisonRole:b,prompt:c.prompt,extEval:j,projectPath:c.projectPath});J?.(`[evolve-v3][ab] Grader prompt (${c.questionId}/${b}, ${B.length} chars)`);let N=Ih({maxAttempts:2,exhaustedDecision:"fail",name:"ab_grader_max_2"}),A=hf(n?.model),S=v?jf(Lf(_),async(E,F)=>{return J?.(`[evolve-v3][ab] Grader promptAsync enqueue session=${E} (${c.questionId}/${b})`),_.session.promptAsync({sessionID:E,agent:Z_,parts:[{type:"text",text:B}],tools:{question:!1},...A?{model:{providerID:A.providerID,modelID:A.modelID}}:{}},{signal:F})},Of(G,{logContext:K,stage:"ab-grader",questionId:c.questionId,role:b})):async(E,F)=>{return J?.(`[evolve-v3][ab] Grader prompt enqueue session=${E} (${c.questionId}/${b})`),_.session.prompt({path:{id:E},body:{agent:Z_,parts:[{type:"text",text:B}],tools:{question:!1},...A?{model:{providerID:A.providerID,modelID:A.modelID}}:{}}},{signal:F})};try{let E=await Mh({...dh(_,{targetShape:"plugin"}),stage:"ab-grader",questionId:c.questionId,role:b,policy:N,createSession:async()=>{let q=oc(u),m=await _.session.create({body:Xh({allowedRoots:q,worktree:u})});return zh(m,q)},runPrompt:S,createTimeoutMs:B0,promptTimeoutMs:U,logContext:K});if(!E.ok)throw Error(`grader session failed: ${E.status} ${E.reason??""}`.trim());let F=v?await th(Lf(_),E.sessionId):E.value,O=uy($y(await Cj(w,F,J),j),j,"metric missing from grader ext_eval_results");p_(w,O),J?.(`[evolve-v3][ab] Grader completed session=${y} grading=${w} verdicts=${O.expectations.length}`)}catch(E){let F=E instanceof Error?E.message:String(E);if(p_(w,kf(y,F,j)),J?.(`[evolve-v3][ab] Grader failed for session=${y}: ${F}`),!$)throw E}}async function Vj(h){let{sessionId:f,worktreePath:_,extEval:n,log:c}=h,b=Fh(),y=ah(b);c?.(`[evolve-v3][ab] AB grading scan ${y}`);let u=Sh.join(_,"grading");bh.mkdirSync(u,{recursive:!0});let U=Sh.join(u,"metrics.json"),$=Sh.join(u,"timing.json"),j=Sh.join(u,"_transcript.md"),J=Sh.join(u,"grading.json"),K=Oj(f);if(!K){let w=`Session not found in OpenCode DB (sessionId=${f}, tried=${b.join(", ")})`,v=Hj(f,w,b.join(", ")),X=dj(f,w);bh.writeFileSync(U,`${JSON.stringify(v,null,2)}
`,"utf-8"),bh.writeFileSync($,`${JSON.stringify(X,null,2)}
`,"utf-8"),bh.writeFileSync(j,`# Transcript unavailable

${w}
`,"utf-8"),p_(J,kf(f,w,n)),c?.(`[evolve-v3][ab] Grading artifacts unavailable for session=${f}: ${w}`);return}let G=$f(K),Z={sessionId:f,...G},z=Bj(K,G),W=Aj(m_(K));bh.writeFileSync(U,`${JSON.stringify(Z,null,2)}
`,"utf-8"),bh.writeFileSync($,`${JSON.stringify(z,null,2)}
`,"utf-8"),bh.writeFileSync(j,W,"utf-8"),c?.(`[evolve-v3][ab] Wrote grading artifacts session=${f} dir=${u} duration_seconds=${z.duration_seconds} transcript_chars=${W.length}`),await qj(h,{transcriptPath:j,metricsPath:U,timingPath:$,gradingJsonPath:J})}function Mj(h){return{questionId:h.questionId,prompt:h.prompt,expectedBehavior:h.expectedBehavior,gradingCriteria:h.gradingCriteria,automatedChecks:h.automatedChecks,projectPath:h.projectPath}}function Ej(h){let f=[];for(let _ of h)f.push({question:_,comparisonRole:"baseline",side:"A",versionLabel:_.versionA,skillVariant:_.skillVariantA,worktreePath:_.worktreePathA}),f.push({question:_,comparisonRole:"treatment",side:"B",versionLabel:_.versionB,skillVariant:_.skillVariantB,worktreePath:_.worktreePathB});return f}var Rj=3600000,B0=60000;async function Sj(h,f,_){if(f==="none"||!f)return"";let n=Sh.join(_,"skill_evolution_workspace",`${h}_evolution_space`);return Sh.join(n,f)}async function U3(h,f,_,n,c={}){let b=Zf({requestLogFilePath:n,sessionId:f?.sessionID});return Dj(h,f,_,b,c)}async function Dj(h,f,_,n,c={}){let b={info:(y)=>Y(y,n),error:(y)=>Y(`[ERROR] ${y}`,n),debug:(y)=>Y(`[DEBUG] ${y}`,n)};try{let{skillName:y,isNew:u,version:U,questions:$,abSessionsPath:j}=_,J=I(),K=Sh.join(J,"skill_evolution_workspace",`${y}_evolution_space`),G=Sh.join(K,U,"SKILL.md"),Z=u?"none":String($[0]?.skillVariantA??"previous");Y(`[evolve-v3][frontend][ab] ========== AB test run start ========== sessionID=${f.sessionID}, skillName=${y}, isNew=${u}, version=${U}, questions=${$.length}`,n);let z=f?.evolveV3SkipStatusPrompt===!0,W=hf(c.model,f?.model),w=(C,T,M,D)=>z?jf(h,async(x,V)=>{if(Y(`[evolve-v3][frontend][ab] AB session started: ${x} (${T}/${M}/side ${D}), promptAsync enqueue`,n),typeof h.session.promptAsync!=="function")throw Error("session.promptAsync is required for evolve V3 AB test stages in daemon mode");return h.session.promptAsync({sessionID:x,agent:Cn,parts:[{type:"text",text:C}],tools:{question:!1},...W?{model:{providerID:W.providerID,modelID:W.modelID}}:{}},{signal:V})},Of(c.waitOptions,{logContext:n,stage:"ab-test",questionId:T,role:M})):async(x,V)=>{if(Y(`[evolve-v3][frontend][ab] AB session started: ${x} (${T}/${M}/side ${D}), prompt enqueue`,n),typeof h.session.prompt!=="function")throw Error("session.prompt is required for evolve V3 AB test stages in plugin mode");return h.session.prompt({path:{id:x},body:{agent:Cn,parts:[{type:"text",text:C}],tools:{question:!1},...W?{model:{providerID:W.providerID,modelID:W.modelID}}:{}}},{signal:V})};Y(`[evolve-v3][frontend][ab] Skill comparison setup: treatment=${U} (${G}), previousVersion=${Z} (baseline skill variant)`,n);let v=Ej($),X=g_(c.abSessionConcurrency);Y(`[evolve-v3][frontend][ab] AB stage plans=${v.length}, concurrency=${X}, execution=flat-parallel`,n),Y(`[evolve-v3][frontend][ab] AB config:
${Jh({skillName:y,isNew:u,version:U,abSessionsPath:j,questionCount:$.length})}`,n),Y(`[evolve-v3][frontend][ab] AB grading scan ${ah(Fh())}`,n);let Q=_.timeoutMs??Rj,d=_.continueOnError??!0;Y(`[evolve-v3][frontend][ab] Timeout: ${Q}ms, continueOnError: ${d}`,n);for(let C of $){let{questionId:T,versionA:M,versionB:D,skillVariantA:x,skillVariantB:V,worktreePathA:g,worktreePathB:p}=C;Y(`[evolve-v3][frontend][ab] Question ${T}: A/baseline=${M}(${x}) @ ${g}, B/treatment=${D}(${V}) @ ${p}`,n)}let B=[],N=[],A=0,S=new l_(X),E=Ih({maxAttempts:3,exhaustedDecision:"fail",name:"ab_session_max_3"}),F=!1,O=null,m=(await Promise.allSettled(v.map(async(C)=>{if(await S.acquire(),F)return;let T;try{let M=Hf();if(M?.isExceeded())throw new Vh({consumed:M.totalConsumed,limit:M.toState().maxTokens,windowId:M.currentWindowId,skillName:y,stage:"ab-test"});let D=c.tokenBudget?.signal??M?.signal,{question:x,comparisonRole:V,side:g,versionLabel:p,skillVariant:s,worktreePath:qh}=C,{questionId:_h,prompt:$n}=x,bf=qh;Y(`[evolve-v3][frontend][ab] ===== Plan ${_h}/${V} (side ${g}) start =====`,n);let Wh=await Sj(y,s,J),b_=an({questionId:_h,comparisonRole:V,skillVariant:s,skillVersionDir:Wh,skillPath:s==="none"?void 0:Sh.join(Wh,"SKILL.md"),prompt:`Task root directory: ${bf}

All file operations for this task must be performed inside this directory.

${$n}`,worktreePath:bf});Y(`[evolve-v3][frontend][ab] AB plan start: question=${_h}, role=${V} (side=${g}), skillVariant=${s}, worktree=${bf}`,n),Y(`[evolve-v3][frontend][ab] AB prompt branch: ${s==="none"?"no-skill-baseline":"skill-enabled-comparison"}`,n),Y(`[evolve-v3][frontend][ab] AB prompt built (${_h}/${V}, ${b_.length} chars)`,n),Y(`[evolve-v3][frontend][ab] [${_h}] Sending prompt to side ${g}, timeout: ${Q}ms`,n);let Zh=await Mh({...dh(h,{targetShape:"plugin"}),stage:"ab-test",questionId:_h,role:V,policy:E,createSession:async()=>{let t=oc(bf),Ef=s!=="none"&&Wh?[Wh]:[],jn=await h.session.create({query:{directory:En()},body:Xh({allowedRoots:t,readOnlyRoots:Ef,worktree:bf,allowBash:!0})}),N3=zh(jn,t,{allowBash:!0,readOnlyRoots:Ef});return T=N3,N3},runPrompt:w(b_,_h,V,g),createTimeoutMs:B0,promptTimeoutMs:Q,logContext:n,signal:D});if(!Zh.ok){if(A++,Y(`[evolve-v3][frontend][ab] [${_h}] Side ${g} failed: status=${Zh.status}, reason=${Zh.reason}`,n),!d)throw Error(`AB ${V} failed for ${_h}: ${Zh.errorMessage}`);return}let Un=await th(h,Zh.sessionId);Y(`[evolve-v3][frontend][ab] [${_h}] Side ${g} promptAsync complete, chars=${Un.length}`,n),Y(`[evolve-v3][frontend][ab] AB session completed: ${Zh.sessionId} (${_h}/${V})`,n),await Vj({sessionId:Zh.sessionId,worktreePath:bf,client:h,context:f,question:Mj(x),comparisonRole:V,extEval:_.ext_eval,promptTimeoutMs:Q,continueOnGraderError:!0,waitOptions:c.waitOptions,log:(t)=>Y(t,n),logContext:n}),N.push({questionId:_h,version:p,sessionId:Zh.sessionId,skillVariant:s}),B.push({questionId:_h,version:p,sessionId:Zh.sessionId,response:Un}),Y(`[evolve-v3][frontend][ab] [${_h}] Side ${g} finished, sessionId: ${Zh.sessionId}`,n),Y(`[evolve-v3][frontend][ab] ===== Plan ${_h}/${V} done =====`,n)}catch(M){A++;let D=M?.message||JSON.stringify(M),x=M?.stack||"";if(Y(`[evolve-v3][frontend][ab] [ERROR] Run error: ${D}`,n),x)Y(`[evolve-v3][frontend][ab] [ERROR] stack: ${x}`,n);if(!d){if(!F)F=!0,O=M,Y("[evolve-v3][frontend][ab] continueOnError=false, stopping new plan dispatch",n);throw M}}finally{S.release()}}))).find((C)=>C.status==="rejected");if(m){let C=N.map((T)=>T.sessionId).filter(Boolean);throw await mf(h,C),m.reason}let P=N.map((C)=>JSON.stringify(C)).join(`
`);bh.writeFileSync(j,P,"utf-8"),Y(`[evolve-v3][frontend][ab] Wrote ab_sessions.jsonl at ${j}, records: ${N.length}`,n);try{let C=b3({skillName:y,iterationVersion:U,questions:$.map((T)=>({questionId:T.questionId,worktreePathA:T.worktreePathA,worktreePathB:T.worktreePathB}))});Y(`[evolve-v3][frontend][ab] Eval-set feedback written: path=${C.feedbackPath}, evalSetVersion=${C.evalSetVersion}`,n)}catch(C){let T=C instanceof Error?C.message:String(C);if(Y(`[evolve-v3][frontend][ab] [WARN] Eval-set feedback rollup failed: ${T}`,n),!d)throw C}let H=`AB tests done: ${B.length} sessions, ${A} failed`;return Y(`[evolve-v3][frontend][ab] ========== AB test run finished ========== ${y}; records=${N.length}, summary=${H}`,n),{abSessionsPath:j,sessionResults:B,failedCount:A}}catch(y){let u=y instanceof Error?y.message:String(y),U=y instanceof Error?y.stack:"";if(Y(`[evolve-v3][frontend][ab] [ERROR] runABTest failed: ${u}`,n),U)Y(`[evolve-v3][frontend][ab] [ERROR] Stack: ${U}`,n);throw y}}import Bh from"fs";import a from"path";import pj from"os";import __ from"fs";import e_ from"path";function Lj(h,f){let _=h.trim(),n=_.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i),c=n?n[1].trim():_;try{return JSON.parse(c)}catch(b){throw Error(`Failed to parse ${f} JSON: ${b instanceof Error?b.message:String(b)}`)}}function Gh(h,f){if(typeof h!=="string"||!h.trim())throw Error(`${f} must be a non-empty string`)}function Dh(h,f){if(!h||typeof h!=="object"||Array.isArray(h))throw Error(`${f} must be an object`)}function mj(h,f){if(h!=="A"&&h!=="B")throw Error(`${f} must be "A" or "B"`)}function Nj(h,f){Dh(h,f);let _=h;for(let n of["priority","category","suggestion","expected_impact"])Gh(_[n],`${f}.${n}`)}function A0(h,f){Dh(h,f);let _=h;if(typeof _.score!=="number")throw Error(`${f}.score must be a number`);if(!Array.isArray(_.issues))throw Error(`${f}.issues must be an array`);for(let[n,c]of _.issues.entries()){Dh(c,`${f}.issues[${n}]`);let b=c;Gh(b.issue,`${f}.issues[${n}].issue`),Gh(b.transcript_evidence,`${f}.issues[${n}].transcript_evidence`)}}function bc(h){let f=Lj(h,"evolve v3 question analysis");if(!f||typeof f!=="object")throw Error("evolve v3 question analysis must be an object");let _=f;Gh(_.question_id,"question_id"),Dh(_.comparison_summary,"comparison_summary");let n=_.comparison_summary;mj(n.winner,"comparison_summary.winner"),Gh(n.winner_skill,"comparison_summary.winner_skill"),Gh(n.loser_skill,"comparison_summary.loser_skill"),Gh(n.comparator_reasoning,"comparison_summary.comparator_reasoning"),Dh(_.instruction_following,"instruction_following");let c=_.instruction_following;A0(c.winner,"instruction_following.winner"),A0(c.loser,"instruction_following.loser"),Dh(_.skill_mechanism_analysis,"skill_mechanism_analysis");let b=_.skill_mechanism_analysis;if(!Array.isArray(b.winner_success_mechanisms))throw Error("skill_mechanism_analysis.winner_success_mechanisms must be an array");if(!Array.isArray(b.loser_failure_mechanisms))throw Error("skill_mechanism_analysis.loser_failure_mechanisms must be an array");for(let[u,U]of b.winner_success_mechanisms.entries()){Dh(U,`skill_mechanism_analysis.winner_success_mechanisms[${u}]`);let $=U;for(let j of["mechanism","skill_evidence","transcript_evidence","why_it_helped"])Gh($[j],`skill_mechanism_analysis.winner_success_mechanisms[${u}].${j}`);if(typeof $.cherry_pickable!=="boolean")throw Error(`skill_mechanism_analysis.winner_success_mechanisms[${u}].cherry_pickable must be a boolean`);if($.cherry_pickable===!0)Dh($.cherry_pick,`skill_mechanism_analysis.winner_success_mechanisms[${u}].cherry_pick`),Gh($.cherry_pick.reason,`skill_mechanism_analysis.winner_success_mechanisms[${u}].cherry_pick.reason`)}for(let[u,U]of b.loser_failure_mechanisms.entries()){Dh(U,`skill_mechanism_analysis.loser_failure_mechanisms[${u}]`);let $=U;for(let j of["mechanism","skill_evidence","transcript_evidence","why_it_hurt"])Gh($[j],`skill_mechanism_analysis.loser_failure_mechanisms[${u}].${j}`);if(Nj($.improvement_suggestion,`skill_mechanism_analysis.loser_failure_mechanisms[${u}].improvement_suggestion`),$.avoid_pattern!==void 0){Dh($.avoid_pattern,`skill_mechanism_analysis.loser_failure_mechanisms[${u}].avoid_pattern`);let j=$.avoid_pattern;Gh(j.pattern,`skill_mechanism_analysis.loser_failure_mechanisms[${u}].avoid_pattern.pattern`),Gh(j.reason,`skill_mechanism_analysis.loser_failure_mechanisms[${u}].avoid_pattern.reason`)}}Dh(_.transcript_insights,"transcript_insights");let y=_.transcript_insights;return Gh(y.winner_execution_pattern,"transcript_insights.winner_execution_pattern"),Gh(y.loser_execution_pattern,"transcript_insights.loser_execution_pattern"),f}function Fj(h,f){return e_.resolve(e_.join(nh(h),`v${f}`,"SKILL.md"))}function T0(h){return{skill_md_path:h,success_mechanisms:[],failure_mechanisms:[]}}function j3(h){if(!h||h.trim()==="none")return;let f=/^v(\d+)$/i.exec(h.trim());if(!f)return;let _=Number(f[1]);return Number.isInteger(_)&&_>=0?_:void 0}function Ij(h,f){if(!__.existsSync(h))return T0(f);try{let _=JSON.parse(__.readFileSync(h,"utf-8"));return{skill_md_path:typeof _.skill_md_path==="string"&&_.skill_md_path.trim()?e_.resolve(_.skill_md_path):f,success_mechanisms:Array.isArray(_.success_mechanisms)?_.success_mechanisms:[],failure_mechanisms:Array.isArray(_.failure_mechanisms)?_.failure_mechanisms:[]}}catch{return T0(f)}}function kj(h,f){return __.mkdirSync(e_.dirname(h),{recursive:!0}),__.writeFileSync(h,`${JSON.stringify(f,null,2)}
`,"utf-8"),e_.resolve(h)}function x0(h,f,_){Hh(h,f,{initReason:"continued_evolution"});let n=Ou(h,f),c=Fj(h,f),b=Ij(n,c),y={skill_md_path:c,success_mechanisms:[...b.success_mechanisms,..._.success_mechanisms??[]],failure_mechanisms:[...b.failure_mechanisms,..._.failure_mechanisms??[]]};return kj(n,y)}function gj(h,f){let _=j3(h.oldRecord.skillVariant),n=j3(h.newRecord.skillVariant);if(f==="A")return{winnerVersion:_,loserVersion:n};return{winnerVersion:n,loserVersion:_}}function Y3(h,f,_,n){if(!__.existsSync(_))return;let c=__.readFileSync(_,"utf-8"),b;try{b=bc(c)}catch(J){let K=J instanceof Error?J.message:String(J);n?.info?.(`[evolve-v3] Skip mechanism persist for ${f.question.questionId}: invalid analysis JSON (${K})`);return}let y=b.comparison_summary.winner,{winnerVersion:u,loserVersion:U}=gj(f,y),$=b.skill_mechanism_analysis,j={questionId:f.question.questionId,winnerVersion:u,loserVersion:U};if(u!==void 0&&$.winner_success_mechanisms.length>0){let J=x0(h,u,{success_mechanisms:$.winner_success_mechanisms});my(h,u,{successMechanismPath:J}),j.winnerAnalysisPath=J,n?.info?.(`[evolve-v3] Persisted ${$.winner_success_mechanisms.length} success mechanism(s) for v${u} (${f.question.questionId})`)}else if(u===void 0&&$.winner_success_mechanisms.length>0)n?.info?.(`[evolve-v3] Skip success mechanisms for ${f.question.questionId}: winner side has no skill version (variant=none)`);if(U!==void 0&&$.loser_failure_mechanisms.length>0){let J=x0(h,U,{failure_mechanisms:$.loser_failure_mechanisms});my(h,U,{failureMechanismPath:J}),j.loserAnalysisPath=J,n?.info?.(`[evolve-v3] Persisted ${$.loser_failure_mechanisms.length} failure mechanism(s) for v${U} (${f.question.questionId})`)}else if(U===void 0&&$.loser_failure_mechanisms.length>0)n?.info?.(`[evolve-v3] Skip failure mechanisms for ${f.question.questionId}: loser side has no skill version (variant=none)`);return j}var C0=60000;function ej(h){if(h.length<=C0)return h;let f=h.slice(0,20000),_=h.slice(-40000);return`${f}

... (${h.length-C0} characters omitted) ...

${_}`}function rj(h,f){return a.join(a.dirname(en(h,f)),"analyzer-inputs")}function Ah(h,f){Bh.mkdirSync(a.dirname(h),{recursive:!0}),Bh.writeFileSync(h,f,"utf-8")}function aj(h){if(typeof h==="number")return String(h);return h.match(/^v?(\d+)$/i)?.[1]??h}function ij(h,f,_,n,c,b,y){let u=I(),U=aj(_),$=a.join(u,"history",h,f,U),j=a.join($,"metrics"),J=a.join($,"transcript"),K=new Date().toISOString().replace(/[:.]/g,"-");Bh.mkdirSync(j,{recursive:!0}),Bh.mkdirSync(J,{recursive:!0});let G=`${JSON.stringify(b,null,2)}
`,Z=`${JSON.stringify(y,null,2)}
`;Ah(a.join(j,"old_metrics.json"),G),Ah(a.join(j,"new_metrics.json"),Z),Ah(a.join(J,"old_transcript.md"),n),Ah(a.join(J,"new_transcript.md"),c),Ah(a.join(j,`${K}_old_metrics.json`),G),Ah(a.join(j,`${K}_new_metrics.json`),Z),Ah(a.join(J,`${K}_old_transcript.md`),n),Ah(a.join(J,`${K}_new_transcript.md`),c)}function tj(h,f,_,n,c,b,y){let u=rj(h,_),U=a.join(u,"old_transcript.md"),$=a.join(u,"new_transcript.md"),j=a.join(u,"old_metrics.json"),J=a.join(u,"new_metrics.json");return Ah(U,n),Ah($,c),Ah(j,`${JSON.stringify(b,null,2)}
`),Ah(J,`${JSON.stringify(y,null,2)}
`),ij(h,_,f,n,c,b,y),{oldTranscriptPath:U,newTranscriptPath:$,oldMetricsPath:j,newMetricsPath:J}}function oj(h,f=1200){let _=typeof h==="string"?h:JSON.stringify(h);if(!_)return"";return _.length>f?`${_.slice(0,f)}...(truncated ${_.length-f} chars)`:_}function sj(h){let f=h.match(/^v?(\d+)$/i);if(!f)return;return Number(f[1])}function q0(h,f,_){return{unavailable:!0,reason:f,sessionId:h,..._?{dbPath:_}:{}}}async function V0(h,f){let _=Fh();try{Y(`[evolve-v3][frontend][analyzer] readSessionFromDbCandidates paths=${_.join(", ")} sessionId=${h}`,f);let n=Qf(_,h);if(!n)return Y(`[evolve-v3][frontend][analyzer] Missing session trajectory for ${h} (tried=${_.join(", ")})`,f),Y(`Session not found: ${h}`,f),{transcript:"",metrics:q0(h,"Session not found in OpenCode DB",_.join(", "))};Y(`[evolve-v3][frontend][analyzer] Session hit: id=${h}, messageCount=${n.messages?.length??0}`,f);let c=ej(m_(n)),b=$f(n);return Y(`[evolve-v3][frontend][analyzer] Session transcript built: sessionId=${h}, chars=${c.length}`,f),{transcript:c,metrics:b}}catch(n){return Y(`Failed to fetch session messages: ${h}, error: ${JSON.stringify(n)}`,f),Y(`[evolve-v3][frontend][analyzer] getSessionAnalyzerInput failed sessionId=${h}: ${n instanceof Error?n.message:String(n)}`,f),{transcript:"Failed to fetch session messages",metrics:q0(h,`Failed to read session analyzer input: ${n instanceof Error?n.message:String(n)}`,_.join(", "))}}}async function J3(h,f,_,n,c={}){let b=Zf({requestLogFilePath:n,sessionId:f?.sessionID});return hY(h,f,_,b,c)}async function hY(h,f,_,n,c={}){let b={info:(y)=>Y(y,n),error:(y)=>Y(`[ERROR] ${y}`,n),debug:(y)=>Y(`[DEBUG] ${y}`,n)};try{Y("[ABAnalyzer] ========== AB analysis run start ==========",n),Y(`[ABAnalyzer] sessionID: ${f.sessionID}`,n);let y=f?.userHomeDir?.trim()||pj.homedir(),u=f?.directory?.trim()||process.cwd(),U=rn(y,u);Y(`[ABAnalyzer] evolve-v3-ab-analyzer agent registered via plugin (agent=${U})`,n);let{skillName:$,version:j,questions:J,abSessionsPath:K}=_,G=Fh(),Z=I(),z=a.join(Z,"skill_evolution_workspace",`${$}_evolution_space`),W=a.join(z,j);if(Y(`[ABAnalyzer] Analysis config skillName: ${$}, version: ${j}, questions: ${J.length}`,n),Y(`[evolve-v3][frontend][analyzer] Analysis stage start for ${$}`,n),Y(`[evolve-v3][frontend][analyzer] Analysis output dir: ${W}`,n),Y("[evolve-v3][frontend][analyzer] Analysis branch: using default stage (runABAnalyzer)",n),Y(`[evolve-v3][frontend][analyzer] AB sessions source path=${K}`,n),Y(`[evolve-v3][frontend][analyzer] Analyzer dbPaths=${G.join(", ")}`,n),!Bh.existsSync(K))throw Y(`[ABAnalyzer] ab_sessions.jsonl missing, failing analysis: ${K}`,n),Y(`[evolve-v3][frontend][analyzer] Analysis failed: ab_sessions file missing at ${K}`,n),Error(`AB analyzer input missing: ${K}`);let v=Bh.readFileSync(K,"utf-8").split(`
`).filter((O)=>O.trim()).map((O)=>JSON.parse(O));Y(`[ABAnalyzer] Loaded ${v.length} AB session records`,n),Y(`[evolve-v3][frontend][analyzer] Loaded ${v.length} AB session records from jsonl`,n);let X=new Map;for(let O of v){let q=X.get(O.questionId)||[];q.push(O),X.set(O.questionId,q)}let Q=[],d=P_(c.analyzerConcurrency),B=new l_(d),N=f?.evolveV3SkipStatusPrompt===!0,A=hf(c.model,f?.model),S=(O,q)=>N?jf(h,async(m,P)=>{let H=q.questionId?` [${q.questionId}]`:"";if(Y(`[ABAnalyzer]${H} ${q.role} session created: ${m}`,n),Y(`[evolve-v3][frontend][analyzer] ${q.role} session started: ${m}${q.questionId?` (${q.questionId})`:""}`,n),Y(`[ABAnalyzer]${H} ${q.role} promptAsync enqueue`,n),typeof h.session.promptAsync!=="function")throw Error("session.promptAsync is required for evolve V3 analyzer stages in daemon mode");return h.session.promptAsync({sessionID:m,agent:X_,parts:[{type:"text",text:O}],tools:{question:!1},...A?{model:{providerID:A.providerID,modelID:A.modelID}}:{}},{signal:P})},Of(c.waitOptions,{logContext:n,stage:q.stage,questionId:q.questionId,role:q.role})):async(m,P)=>{let H=q.questionId?` [${q.questionId}]`:"";if(Y(`[ABAnalyzer]${H} ${q.role} session created: ${m}`,n),Y(`[evolve-v3][frontend][analyzer] ${q.role} session started: ${m}${q.questionId?` (${q.questionId})`:""}`,n),Y(`[ABAnalyzer]${H} ${q.role} prompt enqueue`,n),typeof h.session.prompt!=="function")throw Error("session.prompt is required for evolve V3 analyzer stages in plugin mode");return h.session.prompt({path:{id:m},body:{agent:X_,parts:[{type:"text",text:O}],tools:{question:!1},...A?{model:{providerID:A.providerID,modelID:A.modelID}}:{}}},{signal:P})};Y(`[evolve-v3][frontend][analyzer] Analyzer questions=${J.length}, concurrency=${d}, execution=parallel`,n);let F=(await Promise.allSettled(J.map(async(O)=>{await B.acquire();let q;try{let m=Hf();if(m?.isExceeded())throw new Vh({consumed:m.totalConsumed,limit:m.toState().maxTokens,windowId:m.currentWindowId,skillName:$,stage:"ab-analyzer"});let P=c.tokenBudget?.signal??m?.signal,H=O.questionId,C=X.get(H)||[];if(C.length<2){Y(`[ABAnalyzer] Question ${H}: not enough sessions, skipping`,n),Y(`[evolve-v3][frontend][analyzer] Skip question=${H}: session count=${C.length} (need>=2)`,n);return}let T=C.find((t)=>t.version==="baseline"||t.version.includes("v")&&t.version!==j),M=C.find((t)=>t.version==="treatment"||t.version===j);if(!T||!M){Y(`[ABAnalyzer] Question ${H}: missing version session pair, skipping`,n),Y(`[evolve-v3][frontend][analyzer] Skip question=${H}: missing baseline or treatment session record`,n);return}Y(`[ABAnalyzer] ===== Question ${H} analysis start =====`,n),Y(`[ABAnalyzer] versionA=${T.version}, versionB=${M.version}`,n),Y(`[evolve-v3][frontend][analyzer] Analyzer input: question=${H}, old=${T.skillVariant??T.version??"none"}, new=${M.skillVariant??M.version}`,n);let D=await V0(T.sessionId,n),x=await V0(M.sessionId,n),V=D.transcript,g=x.transcript;Y(`[ABAnalyzer] [${H}] Session messages loaded \u2013 A: ${V.length} chars, B: ${g.length} chars`,n),Y(`[evolve-v3][frontend][analyzer] Transcript lengths: question=${H}, oldChars=${V.length}, newChars=${g.length}`,n),Y(`[evolve-v3][frontend][analyzer] Question ${H}: A=${T.sessionId} (${T.version}, ${V.length} chars) B=${M.sessionId} (${M.version}, ${g.length} chars)`,n);let p=of($,H,_.comparator),s=tj($,j,H,V,g,D.metrics,x.metrics),qh={question:{questionId:O.questionId,intention:O.intention||"",projectPath:O.projectPath||"",prompt:O.prompt||"",expectedBehavior:O.expectedBehavior,gradingCriteria:O.gradingCriteria||"",automatedChecks:O.automatedChecks||"",isNew:!1},oldRecord:{questionId:T.questionId,comparisonRole:"baseline",skillVariant:T.skillVariant||"none",skillVersionDir:T.skillVersionDir,prompt:T.prompt,worktreePath:T.worktreePath||"",sessionId:T.sessionId},newRecord:{questionId:M.questionId,comparisonRole:"treatment",skillVariant:M.skillVariant||"none",skillVersionDir:M.skillVersionDir,prompt:M.prompt,worktreePath:M.worktreePath||"",sessionId:M.sessionId},...s,oldSkillVersion:T.skillVersion,newSkillVersion:M.skillVersion},_h={...qh,comparator:Py(qh,_.comparator)},$n=tn($,_h,p);Y(`[ABAnalyzer] [${H}] Analyzer prompt built, length: ${$n.length} chars`,n);let bf=Ih({maxAttempts:3,exhaustedDecision:"skip",name:"analyzer_session_max_3_then_skip"}),Wh=await Mh({...dh(h,{targetShape:"plugin"}),stage:"ab-analyzer",questionId:H,role:"question-analysis",policy:bf,createSession:async()=>{let t=qb($,H),Ef=await h.session.create({body:Xh({allowedRoots:t})}),jn=zh(Ef,t);return q=jn,jn},runPrompt:S($n,{stage:"ab-analyzer",questionId:H,role:"question-analysis"}),promptTimeoutMs:3600000,logContext:n,signal:P});if(!Wh.ok){if(Y(`[ABAnalyzer] [${H}] Analyzer session failed: status=${Wh.status}, reason=${Wh.reason}`,n),Wh.status==="skipped")return;throw Error(`AB analyzer failed for ${H}: status=${Wh.status}, reason=${Wh.reason}, message=${Wh.errorMessage}`)}let b_=Wh.sessionId,Zh=await th(h,b_);if(Y(`[ABAnalyzer] [${H}] Analyzer promptAsync complete, chars=${Zh.length}`,n),Y(`[ABAnalyzer] [${H}] Analysis done, sessionId: ${b_}`,n),Bh.existsSync(p)&&Bh.statSync(p).size>0){Y(`[evolve-v3][frontend][analyzer] Analyzer JSON artifact: ${p} bytes=${Bh.statSync(p).size}`,n);try{let t=Y3($,_h,p);if(t)Y(`[evolve-v3][frontend][analyzer] Mechanisms persisted question=${H} winner=v${t.winnerVersion??"none"} loser=v${t.loserVersion??"none"}`,n)}catch(t){let Ef=t instanceof Error?t.message:String(t);Y(`[evolve-v3][frontend][analyzer] Mechanism persist failed question=${H}: ${Ef}`,n)}}else Y(`[evolve-v3][frontend][analyzer] Analyzer JSON not written at ${p} (agent must use write tool)`,n);let Un={questionId:H,versionA:T.version,versionB:M.version,sessionIdA:T.sessionId,sessionIdB:M.sessionId,analysis:Zh,timestamp:Date.now()};Q.push(Un),Y(`[ABAnalyzer] ===== Question ${H} analysis done =====`,n)}catch(m){let P=m instanceof Error?m.message:String(m);throw Y(`[ABAnalyzer] [${O.questionId}] [ERROR] Analysis error: ${P}`,n),m}finally{B.release()}}))).find((O)=>O.status==="rejected");if(F){let O=Q.map((q)=>q.sessionId).filter(Boolean);throw await mf(h,O),F.reason}if(!Q0)Y("[evolve-v3][frontend][analyzer] Summary stage disabled; stopping after per-question AB analysis",n);else{let O=sj(j),q=O===void 0?j:`v${O}`,m=a.join(z,"evolve_history.md"),P=a.join(W,"SKILL.md"),H=a.join(W,`${q}_evidence.md`),C=O!==void 0&&O>0?O-1:void 0,T=C===void 0?void 0:a.join(z,`v${C}`,`v${C}_evidence.md`),M=T&&Bh.existsSync(T)?T:void 0,D=[];for(let x of Q){let V=of(_.skillName,x.questionId,_.comparator);if(!Bh.existsSync(V)){Y(`[evolve-v3][frontend][summary] Missing analyzer JSON for question=${x.questionId}, path=${V}`,n);continue}let g=Bh.statSync(V);if(!g.isFile()||g.size===0){Y(`[evolve-v3][frontend][summary] Invalid analyzer JSON for question=${x.questionId}, path=${V}, bytes=${g.size}`,n);continue}D.push({questionId:x.questionId,analysisPath:V,sessionId:x.sessionIdB,analysisFileBytes:g.size,rawResponse:x.analysis})}if(D.length>0&&O!==void 0){let V=ly({skillName:$,version:O,previousVersion:C,versionDir:W,historyPath:m,skillPath:P,evidencePath:H,previousEvidencePath:M,questionResults:D});Y("[evolve-v3][frontend][summary] Summary branch: using dynamic prompt builder",n),Y(`[evolve-v3][frontend][summary] Summary prompt built (${V.length} chars)`,n);let g=Ih({maxAttempts:3,exhaustedDecision:"fail",name:"summary_session_max_3"}),p=await Mh({...dh(h,{targetShape:"plugin"}),stage:"ab-summary",role:"summary",policy:g,createSession:async()=>{let s=Vb($),qh=await h.session.create({body:Xh({allowedRoots:s})});return zh(qh,s)},runPrompt:S(V,{stage:"ab-summary",role:"summary"}),promptTimeoutMs:3600000,logContext:n,signal:c.tokenBudget?.signal??Hf()?.signal});if(p.ok){let s=await th(h,p.sessionId),qh=s;Y(`[evolve-v3][frontend][summary] Summary promptAsync complete, chars=${s.length}`,n),Y(`[evolve-v3][frontend][summary] Summary session completed: ${p.sessionId}`,n),Y(`[evolve-v3][frontend][summary] Summary response preview session=${p.sessionId}:
${oj(qh)}`,n)}else throw Y(`[evolve-v3][frontend][summary] Summary session failed after retries: status=${p.status}, reason=${p.reason}, summaryStatus=failed`,n),Error(`AB summary failed: status=${p.status}, reason=${p.reason}, message=${p.errorMessage}`)}else Y(`[evolve-v3][frontend][summary] Skip dynamic summary prompt: validAnalyzerJsonCount=${D.length}, version=${j}`,n);Y(`[evolve-v3][frontend][summary] Summary loaded per-question analyzer artifacts count=${D.length}`,n)}return Y(`[ABAnalyzer] AB analysis complete, ${Q.length} question(s)`,n),Y("[ABAnalyzer] ========== AB analysis run finished ==========",n),{analysisResultsPath:W}}catch(y){let u=y instanceof Error?y.message:String(y),U=y instanceof Error?y.stack:"";if(Y(`[ABAnalyzer] [ERROR] runABAnalyzer failed: ${u}`,n),U)Y(`[ABAnalyzer] [ERROR] Stack: ${U}`,n);throw y}}import lh from"path";import Xf from"fs";var K3=new Map,M0=new Set;function JW(h,f){let _=K3.get(h)??[];_.push(f),K3.set(h,_)}async function fY(h){if(M0.has(h))return;if(h==="after-skill-authored"){let{registerSkillLensPreAbHook:f}=await import("B:/~BUN/root/chunk-75y03x5e.js");f()}else if(h==="after-ab-session-graded"){let{registerSkillLensIncrementalHook:f}=await import("B:/~BUN/root/chunk-75y03x5e.js");f()}else{let{registerSkillLensPostAbHook:f}=await import("B:/~BUN/root/chunk-75y03x5e.js");f()}M0.add(h)}async function _Y(h,f){if(!(f??W_()).enabled)return;let n=K3.get(h.point)??[];for(let c of n)await c(h)}async function E0(h){let f=W_();if(!f.enabled)return;await fY("after-skill-authored"),await _Y({point:"after-skill-authored",client:h.client,context:h.context,iterationEnv:h.iterationEnv,skillPaths:{skillMdPath:h.skillMdPath,evidencePath:h.evidencePath},requestLogFilePath:h.requestLogFilePath},f)}var R0="evolve-v3-skill-author";var D0="v";function L0(h){return`${D0}${h}`}function m0(h){return parseInt(h.substring(D0.length))}function nY(h,f){let _=lh.join(h,f),n=lh.join(_,"SKILL.md"),c=lh.join(_,`${f}_evidence.md`);return{versionDir:_,skillMdPath:n,evidencePath:c}}function N0(h,f){let _=Jy(h,f);if(_===null)return null;let n=L0(_),c=lh.join(h,n),b=lh.join(c,"SKILL.md"),y=lh.join(c,`${n}_evidence.md`);return{prevVersionDir:c,prevSkillMdPath:b,prevEvidencePath:y}}function cY(h,f,_){let n=N0(h,f);if(!n)return Y(`[writeSkillMd] No valid previous version (needs Skill.md/SKILL.md), current=v${f}`,_),{prevSkillContent:"",prevEvidenceContent:""};let c="",b="";try{if(Xf.existsSync(n.prevSkillMdPath))c=Xf.readFileSync(n.prevSkillMdPath,"utf-8"),Y(`[writeSkillMd] Loaded previous SKILL.md, size: ${c.length}`,_);else Y(`[writeSkillMd] Previous SKILL.md missing: ${n.prevSkillMdPath}`,_)}catch(y){Y(`[writeSkillMd] Failed to read previous SKILL.md: ${y}`,_)}try{if(Xf.existsSync(n.prevEvidencePath))b=Xf.readFileSync(n.prevEvidencePath,"utf-8"),Y(`[writeSkillMd] Loaded previous evidence, size: ${b.length}`,_);else Y(`[writeSkillMd] Previous evidence missing: ${n.prevEvidencePath}`,_)}catch(y){Y(`[writeSkillMd] Failed to read previous evidence: ${y}`,_)}return{prevSkillContent:c,prevEvidenceContent:b}}function yY(h,f,_){if(_)return`# ${h} Evidence

## Reason (create_skill)

This skill "${f}" is created for the first time.

`;return`# ${h} Evidence

## Iteration notes

Version ${h} refines the skill from v${m0(h)-1}.

### Drivers

(To be filled after analyzer runs with session/feedback summaries.)

`}function bY(h,f,_,n,c){if(!Xf.existsSync(h)){let b=yY(f,_,n);try{Xf.writeFileSync(h,b,"utf-8"),Y(`[writeSkillMd] Created default evidence file: ${h}`,c)}catch(y){throw Y(`[writeSkillMd] Failed to create evidence file: ${y}`,c),y}}}async function G3(h,f,_,n,c,b={},y){let u=Zf({requestLogFilePath:c,sessionId:_?.sessionID});return uY(h,f,_,n,u,b,y)}async function uY(h,f,_,n,c,b={},y){Y("[WriteSkill] ========== Start ==========",c),Y(`[WriteSkill] sessionID: ${_.sessionID}, skillName: ${n.skillName}, version: ${n.version}, isNew: ${n.isNew}`,c);let{skillName:u,isNew:U,version:$,skillSpaceDir:j}=n,J=f.user_intention?[f.user_intention]:[],K=m0($);Y(`[WriteSkill] skillSpaceDir: ${j}`,c),Y(`[WriteSkill] userIntentions: ${JSON.stringify(J)}`,c);let{skillMdPath:G,evidencePath:Z}=nY(j,$),z=U?"create_new_skill":"iteration";Y(`[WriteSkill] Target paths \u9225?skillMdPath: ${G}`,c),Y(`[WriteSkill] Target paths \u9225?evidencePath: ${Z}`,c),Y(`[WriteSkill] evidenceType: ${z}`,c);let W=N0(j,K),{prevSkillContent:w,prevEvidenceContent:v}=cY(j,K,c),X=Tu(u,K);Au(u,K,X),Y(`[WriteSkill] reference versions for v${K} (top performance): [${X.join(", ")||"none"}]`,c),Y(`[WriteSkill] Building authorQuery, currentVersion: ${K}, isNewSkill: ${U}`,c);let Q=L_({skillName:u,version:K,skillAuthorWorkingDir:j,paths:{skillPath:G,evidencePath:Z},targetSkillPath:G,intentions:J,previous:U?void 0:{previousSkillContent:w,previousSkillPath:W?.prevSkillMdPath??"",previousEvidenceContent:v,previousEvidencePath:W?.prevEvidencePath??""},...Fu(j,K)});Y(`[WriteSkill] authorQuery ready, length: ${Q.length}`,c);let d;if(U)d="none";else if(W)d=lh.basename(W.prevVersionDir);else d="none";Y(`[evolve-v3][frontend][skill-author] Skill author stage start for ${u}`,c),Y(`[evolve-v3][frontend][skill-author] Skill author context: version=${$}, previous=${d}, target=${G}`,c),Y(`[evolve-v3][frontend][skill-author] Skill author target directory: ${n.versionDir}; targetSkillPath=${G}; evidencePath=${Z}`,c),Y(`[evolve-v3][frontend][skill-author] Skill author prompt branch: previous=${d}, target=${$}`,c),Y(`[evolve-v3][frontend][skill-author] Skill author prompt built (${Q.length} chars)`,c);let B=y??{info:(P)=>Y(P,c),error:(P)=>Y(`[ERROR] ${P}`,c),debug:(P)=>Y(`[DEBUG] ${P}`,c)},N=Ih({maxAttempts:1,exhaustedDecision:"fail",name:"step3_skill_author_single_attempt"}),A=5,S=0,E=0,F=Date.now(),O=_?.evolveV3SkipStatusPrompt===!0,q=hf(b.model,_?.model);while(S<A){let P=O?jf(h,async(x,V)=>{if(Y(`[WriteSkill] LLM session created, sessionId: ${x}`,c),Y(`[evolve-v3][frontend][skill-author] Skill author session started: ${x}`,c),Y("[WriteSkill] Calling LLM to generate SKILL.md (promptAsync)...",c),typeof h.session.promptAsync!=="function")throw Error("session.promptAsync is required for writeSkillMd in daemon mode");return h.session.promptAsync({sessionID:x,agent:R0,parts:[{type:"text",text:Q}],...q?{model:{providerID:q.providerID,modelID:q.modelID}}:{}},{signal:V})},Of(b.waitOptions,{logContext:c,stage:"skill-author"})):async(x,V)=>{if(Y(`[WriteSkill] LLM session created, sessionId: ${x}`,c),Y(`[evolve-v3][frontend][skill-author] Skill author session started: ${x}`,c),Y("[WriteSkill] Calling LLM to generate SKILL.md (prompt)...",c),typeof h.session.prompt!=="function")throw Error("session.prompt is required for writeSkillMd in plugin mode");return h.session.prompt({path:{id:x},body:{agent:R0,parts:[{type:"text",text:Q}],...q?{model:{providerID:q.providerID,modelID:q.modelID}}:{}}},{signal:V})},H=await Mh({...dh(h,{targetShape:"plugin"}),stage:"skill-author",policy:N,createSession:async()=>{let x=Cb(u),V=xb(n.publishProjectDir,_.userHomeDir),g=await h.session.create({body:Xh({allowedRoots:x,readOnlyRoots:V})});return zh(g,x,{readOnlyRoots:V})},runPrompt:P,promptTimeoutMs:3600000,logContext:c});if(E+=H.attempts,!H.ok)throw Error(`Step3 skill-author session failed: status=${H.status}, reason=${H.reason}, message=${H.errorMessage}`);let C=H.sessionId,T=await th(h,C);Y(`[WriteSkill] promptAsync complete, response length: ${T.length}`,c),Y(`[evolve-v3][frontend][skill-author] Skill author session completed: ${C}, responseChars=${T.length}`,c);let M=Xf.existsSync(G),D=M?Xf.statSync(G).size:0;if(M&&D>0){Y(`[WriteSkill] SKILL.md validation passed, size: ${D} bytes`,c),Y(`[evolve-v3][frontend][skill-author] Validator final: finalStatus=success skillMdPath=${G} evidencePath=${Z} watchdogAttempts=${E} validatorAttempts=${S} elapsedMs=${Date.now()-F}`,c);break}if(await mf(h,[C]),S++,S>=A)throw Y(`[evolve-v3][frontend][skill-author] validator_failed stage=skill-author validatorAttempt=${S}/${A} sessionId=${H.sessionId} reason=missing_or_empty_skill_file skillMdPath=${G} size=${D} decision=fail`,c),Error(`Step3 skill-author validation failed after ${A} attempts: SKILL.md missing or empty at ${G}`);Y(`[evolve-v3][frontend][skill-author] validator_retry stage=skill-author validatorAttempt=${S}/${A} sessionId=${H.sessionId} reason=missing_or_empty_skill_file skillMdPath=${G} size=${D} decision=retry`,c)}let m=Jy(j,K);if(m!==null){let P=lh.join(j,L0(m)),H=lh.dirname(G),C=Du(H,P);Y(`[WriteSkill] Bundled sync from ${P}: copied=[${C.copied.join(", ")}] skipped=[${C.skippedExisting.join(", ")}] missingInSource=[${C.missingInSource.join(", ")}]`,c),L(y,`[evolve-v3][skill-author] syncListedBundled: copied=${C.copied.length} skipped=${C.skippedExisting.length} missingInSource=${C.missingInSource.length}`)}else Y("[WriteSkill] Bundled sync skipped: no previous valid version",c);return bY(Z,$,u,U,c),Y(`[WriteSkill] Evidence file ready: ${Z}`,c),Bu(u,K,Z),Y(`[WriteSkill] manifest versions[${K}].evidencePath=${lh.resolve(Z)}`,c),await E0({client:h,context:_,iterationEnv:n,skillMdPath:G,evidencePath:Z,requestLogFilePath:c}),Y("[WriteSkill] ========== Done ==========",c),Y(`[WriteSkill] skillMdPath: ${G}, evidencePath: ${Z}`,c),{skillMdPath:G,evidencePath:Z}}import eh from"fs";import c_ from"path";import r from"fs";import fh from"path";function $Y(h){return h.includes("already exists")}async function zf(h,f,_){if(r.existsSync(_))await qf(_,{repoPath:h});await a_(h,f).catch(()=>{})}async function UY(h,f,_,n,c){if(!r.existsSync(h))return;let b=_.trim(),y=b?{repoPath:b}:void 0,u=r.readdirSync(h,{withFileTypes:!0}),U=0;for(let j of u){if(!j.isDirectory())continue;let J=j.name,K=fh.join(h,J),G=fh.join(K,"A"),Z=fh.join(K,"B");try{if(b){if(await zf(b,ph(f,J,"A"),G),await zf(b,ph(f,J,"B"),Z),r.existsSync(K)&&!r.existsSync(G)&&!r.existsSync(Z))await qf(K,y)}if(r.existsSync(K))r.rmSync(K,{recursive:!0,force:!0});U++}catch(z){let W=z instanceof Error?z.message:String(z);if(L(n,`[PrepareEnv] Failed clearing skill ABTestDir entry "${J}" (continuing): ${W}`),Y(`[evolve-v3][frontend][workspace] Failed clearing ABTestDir/${f}/${J}: ${W}`,c),r.existsSync(K))r.rmSync(K,{recursive:!0,force:!0})}}let $=fh.join(h,"ab_sessions.jsonl");r.writeFileSync($,"","utf-8"),L(n,`[PrepareEnv] Cleared ${U} director(ies) under skill ABTestDir: ${h}`),L(n,`[evolve-v3][frontend][workspace] Skill ABTestDir reset: removed ${U} subdirectories, cleared ab_sessions.jsonl`)}async function jY(h,f,_,n,c){let b=h.trim();if(!b||!r.existsSync(b))return;for(let y of n){let u=y.questionId?.trim();if(!u)continue;try{await zf(b,ph(_,u,"A"),fh.join(f,u,"A")),await zf(b,ph(_,u,"B"),fh.join(f,u,"B")),await zf(b,`eval-${u}-A`,fh.join(f,u,"A")),await zf(b,`eval-${u}-B`,fh.join(f,u,"B"))}catch(U){let $=U instanceof Error?U.message:String(U);L(c,`[PrepareEnv] Failed clearing eval branches for ${u} (continuing): ${$}`)}}}async function F0(h,f,_,n,c,b){await zf(h,f,_).catch(()=>{});try{return await $c(h,f,_)}catch(y){let u=y instanceof Error?y.message:String(y);if(!$Y(u))throw y;return Y(`[evolve-v3][frontend][workspace] Slot conflict for ${n}/${c}, clearing and retrying: branch=${f}, dest=${_}`,b),await zf(h,f,_),await $c(h,f,_)}}async function i_(h){let{payload:f,targetSkillName:_,projectRepoRoot:n,expectationsSourcePath:c,logger:b,requestLogFilePath:y}=h,u=_.trim();if(!u)throw Error("buildIterationEnvironmentCore: targetSkillName must be non-empty");if(dy(f.isNew,f.intention),f.skillName&&f.skillName.trim()!==u)throw Error(`expectations skillName "${f.skillName}" does not match target skill "${u}"`);let U=u,$=f.isNew,j=f.intention,J=f.targetSource??rf({skillName:U,isNew:$,projectDir:n.trim(),homeDir:h.homeDir}),K=Nn(f.expectations,{isNew:f.isNew,intention:f.intention}),G=c??"(in-memory payload)";L(b,`[PrepareEnv] Task data \u2014 skillName: ${U}, isNew: ${$}, intention: ${j}, questions: ${K.length} source=${G}`);let Z=I(),z=Tf(U),W=fh.join(Z,"skill_evolution_workspace");r.mkdirSync(z,{recursive:!0}),r.mkdirSync(W,{recursive:!0});let w=fh.join(W,`${U}_evolution_space`);r.mkdirSync(w,{recursive:!0}),cu({skillName:U,logger:b}),L(b,`[evolve-v3][frontend][workspace] Preparing workspace for ${U} from ${G}`);let v=Vf(U);L(b,`[evolve-v3][frontend][workspace] Resolved paths: evolveRoot=${v.evolveRootDir}, skillWorkspace=${v.skillWorkspaceDir}, abTestDir=${v.abTestDir}`),L(b,`[evolve-v3][frontend][workspace] Task payload summary:
${Jh({skillName:U,isNew:$,intention:j,questionCount:K.length})}`);let X=r_(U);if(!r.existsSync(X))r.writeFileSync(X,`# Evolve History

`,"utf-8"),L(b,`[PrepareEnv] Created evolve_history.md: ${X}`);let Q=d_(w),d=Q.length>0?Q[0]:-1;L(b,`[PrepareEnv] Valid version dirs (Skill.md/SKILL.md present): ${Q.length>0?Q.map((H)=>`v${H}`).join(", "):"none"}`);let B;if($&&d===-1)L(b,"[PrepareEnv] isNew=true first batch: baseline/ anchor (head=baseline), candidate v0"),O_(w),B=0;else if(!$&&d===-1){L(b,"[PrepareEnv] isNew=false and no version dirs yet; copying existing skill into v0"),B=0;let H=fh.join(w,"v0");Lh(H);let C=C_(U),T=h.collectedSkills?.find((g)=>g.name===U),M={projectDir:n.trim(),homeDir:h.homeDir?.trim()||void 0},D=Af(U,"project",M),x=Af(U,"user",M),V=(C?.registeredPackagePath&&r.existsSync(C.registeredPackagePath)?C.registeredPackagePath:"")||(T?.source!=="evolve"&&T?.path&&r.existsSync(T.path)?T.path:"")||(D&&r.existsSync(D)?D:"")||(x&&r.existsSync(x)?x:"");if(V&&r.existsSync(V)){let{copied:g,skipped:p}=Xy({sourceDir:V,destDir:H,mode:"sync_back"});L(b,`[PrepareEnv] Copied skill package -> v0/: copied=${g.length}, skipped=${p.length}`)}else L(b,`[PrepareEnv] Skill path not found: ${V}`);if(wh(H))d=0,L(b,"[PrepareEnv] v0 has Skill.md/SKILL.md; treating as valid previous version");else L(b,"[PrepareEnv] v0 has no Skill.md/SKILL.md; not counted as valid version");B=1}else B=d+1;let N=!$&&d>=0?d:void 0,A=fh.join(w,`v${B}`);if(Lh(A),L(b,`[PrepareEnv] Created version directory: v${B} at ${A}`),L(b,`[evolve-v3][frontend][workspace] Using workspace version v${B} at ${A}`),d>=0)L(b,`[evolve-v3][frontend][workspace] previousVersion=v${d} (latest valid version with Skill.md/SKILL.md)`);else L(b,"[evolve-v3][frontend][workspace] previousVersion=none (no valid historical version with Skill.md/SKILL.md)");let S=n.trim();if(r.existsSync(z))await UY(z,U,S&&r.existsSync(S)?S:"",b,y);if(S&&r.existsSync(S))await jY(S,z,U,K,b);let E=new Set;for(let[H,C]of K.entries()){let T=C.questionId||`q_${Date.now()}`,M=C.projectPath||S;if(L(b,`[evolve-v3][frontend][workspace] [question ${H+1}/${K.length}] ${T} (is_new=${$}) project=${M}`),S&&r.existsSync(S)){let D=fh.join(z,T);try{let x=fh.join(D,"A"),V=fh.join(D,"B"),g=ph(U,T,"A"),p=ph(U,T,"B");L(b,`[evolve-v3][frontend][workspace] Creating baseline worktree (role=baseline, suffix=A): branch=${g}, dest=${x}`);let s=await F0(S,g,x,T,"baseline",y);L(b,`[PrepareEnv] Created worktree A: ${T} -> ${s}`),L(b,`[evolve-v3][frontend][workspace] Created baseline worktree for ${T}: ${s}`),L(b,`[evolve-v3][frontend][workspace] Creating treatment worktree (role=treatment, suffix=B): branch=${p}, dest=${V}`);let qh=await F0(S,p,V,T,"treatment",y);L(b,`[PrepareEnv] Created worktree B: ${T} -> ${qh}`),L(b,`[evolve-v3][frontend][workspace] Created treatment worktree for ${T}: ${qh}`)}catch(x){let V=x instanceof Error?x.message:String(x);L(b,`[PrepareEnv] [ERROR] Failed to create worktrees: ${T}, error: ${x}`),L(b,`[evolve-v3][frontend][workspace] Failed creating worktrees for ${T}: ${V}`),E.add(T)}}else L(b,`[PrepareEnv] Skipping worktrees: project path missing: ${S}`),L(b,`[evolve-v3][frontend][workspace] Skip worktrees: project repo path missing or not found: ${S}`)}let F=B,O=`v${F}`,q=fh.join(z,"ab_sessions.jsonl");if(!r.existsSync(q))r.writeFileSync(q,"","utf-8"),L(b,`[PrepareEnv] Created ab_sessions.jsonl: ${q}`);L(b,`[evolve-v3][frontend][workspace] Parsed ${K.length} workspace questions (raw task expectations)`);let m=K.filter((H)=>{let C=H.questionId||"";if(E.has(C))return L(b,`[evolve-v3][frontend][workspace] Skipping question ${C}: worktree creation failed`),!1;return!0}).map((H)=>{let C=H.questionId||"",T=fh.join(z,C),M=H.projectPath||S,D=Wf(U,$),x=D!==void 0,V=x?`v${D}`:"baseline",g=O,p=x?`v${D}`:"none",s=O;return{questionId:C,intention:j,prompt:H.prompt,expectedBehavior:H.expectedBehavior,gradingCriteria:H.gradingCriteria,automatedChecks:H.automatedChecks,projectPath:M,worktreePathA:fh.join(T,"A"),worktreePathB:fh.join(T,"B"),versionA:V,versionB:g,skillVariantA:p,skillVariantB:s}});L(b,`[evolve-v3][frontend][workspace] Workspace prepared: skill=${U}, version=${O}, abWorktreePairs=${m.length}, processedQuestions=${m.length}`),L(b,`[evolve-v3][frontend][workspace] Question worktree summary:
${Jh(m.map((H)=>({questionId:H.questionId,projectPath:H.projectPath,baseline:{role:"baseline",suffix:"A",path:H.worktreePathA,versionLabel:H.versionA,skillVariant:H.skillVariantA},treatment:{role:"treatment",suffix:"B",path:H.worktreePathB,versionLabel:H.versionB,skillVariant:H.skillVariantB}})))}`);let P={skillName:U,isNew:$,version:O,versionDir:A,skillSpaceDir:w,abSessionsPath:q,questions:m,targetSource:J,publishProjectDir:n.trim(),...f.ext_eval!==void 0?{ext_eval:f.ext_eval}:{}};if(ch(U),$&&B===0&&d===-1)if(!R(U).versions["0"])du(U,B);else gn({skillName:U,isNew:$,candidateVersion:B,initReason:"continued_evolution"});else if(!$&&d===0&&B===1){if(!R(U).versions["0"]){Hh(U,0,{initReason:"imported_existing_skill_v0",derivedBy:[]});let C=R(U);C.pointers.head=0,Yh(U,C,{reason:"imported_existing_skill_set_head_v0"})}gn({skillName:U,isNew:$,candidateVersion:B,initReason:"continued_evolution"})}else gn({skillName:U,isNew:$,candidateVersion:B,initReason:"continued_evolution"});return{iterationEnv:P,versionNumber:F,previousVersion:N}}async function Uc(h,f){L(void 0,`[evolve-v3] Cleanup start: ${h.abWorktrees.length} AB worktrees`);for(let _ of h.abWorktrees){if(!_.created||_.deleted)continue;L(void 0,`[evolve-v3] Removing worktree: ${_.destPath}`),await qf(_.destPath,{repoPath:_.projectPath}),_.deleted=!0}if(eh.existsSync(f.abTestDir)){if(eh.readdirSync(f.abTestDir).length===0)eh.rmSync(f.abTestDir,{recursive:!0,force:!0}),L(void 0,`[evolve-v3] Removed empty ABTestDir: ${f.abTestDir}`)}}function YY(h){if(!h?.trim())return"unknown";return h.replace(/[\\/:*?"<>|]/g,"_").trim()||"unknown"}function JY(h){let _=new Date(h.getTime()+28800000).toISOString(),n=_.slice(0,10),c=_.slice(11,19).replace(/:/g,"");return`${n}_${c}`}function W3(h,f=new Date){let _=c_.join(I(),"logs","daemons");eh.mkdirSync(_,{recursive:!0});let n=YY(h.trim()||"unknown"),c=JY(f);return c_.join(_,`${c}_${n}.log`)}function I0(h){return{info:(f)=>Y(f,h),error:(f)=>Y(f,h)}}function KY(h,f){if(!h)return f;return{info:(_)=>{h.info(_),f.info(_)},error:(_)=>{h.error(_),f.error(_)}}}function jc(h,f){let _=h.expectationsJsonlPath?.trim();if(!_)return;let n=c_.resolve(_),c,b;if(eh.existsSync(n)){c=eh.readFileSync(n,"utf-8");try{let U=JSON.parse(c);if(Object.prototype.hasOwnProperty.call(U,"ext_eval"))b=U.ext_eval}catch{}}let y={skillName:h.skillName,isNew:h.isNew,intention:h.intention,expectations:h.expectations};if(b!==void 0)y.ext_eval=b;let u=`${JSON.stringify(y,null,2)}
`;eh.mkdirSync(c_.dirname(n),{recursive:!0}),eh.writeFileSync(n,u,"utf-8"),ln(h.skillName,{expectations:h.expectations,previousExpectationsJson:c,writtenExpectationsJson:u},{requestLogFilePath:f})}async function Yc(h,f){let _=f??W3(h.skillName),n=I0(_),c=KY(h.logger,n),b=M_(h.expectations),y={skillName:h.skillName.trim(),isNew:h.isNew,intention:h.intention,expectations:b,...h.ext_eval!==void 0?{ext_eval:h.ext_eval}:{},...h.targetSource!==void 0?{targetSource:h.targetSource}:{}},U=(b.map(($)=>$.project_path.trim()).find(Boolean)??h.projectDir).trim();return await i_({payload:y,targetSkillName:h.skillName,projectRepoRoot:U,expectationsSourcePath:h.expectationsJsonlPath,logger:c,requestLogFilePath:_})}function Jc(h,f,_){let n=Nn(h.expectations,{isNew:h.isNew,intention:h.intention}),c=[];for(let b of f.questions)c.push({questionId:b.questionId,comparisonRole:"baseline",projectPath:b.projectPath,destPath:b.worktreePathA,created:!0,deleted:!1}),c.push({questionId:b.questionId,comparisonRole:"treatment",projectPath:b.projectPath,destPath:b.worktreePathB,created:!0,deleted:!1});return{skillName:h.skillName,expectationsJsonlPath:h.expectationsJsonlPath,questionCount:n.length,questions:n,status:"workspace-prepared",skillWorkspaceDir:f.skillSpaceDir,version:_.versionNumber,versionDir:f.versionDir,previousVersion:_.previousVersion,abWorktrees:c}}async function Kc(h,f,_,n,c){let b=Zf({requestLogFilePath:c,sessionId:f?.sessionID}),y=I0(b);try{Y("[PrepareEnv] ========== Creating iteration workspace ==========",b);let u=_.trim();if(!u)throw Error("adaptIterationEnvironmentForPlugin: targetSkillName must be non-empty");let U=String(f?.directory??"").trim();if(!U)throw Error("adaptIterationEnvironmentForPlugin: context.directory must be a non-empty project repo root");let $=c_.join(I(),"skill_evolution_workspace",`${u}_evolution_space`);eh.mkdirSync($,{recursive:!0});let j=c_.join($,"expectations.json");Y(`[PrepareEnv] Reading expectations: ${j}`,b);let J=Kf(j),K={...J,expectations:M_(J.expectations)},{iterationEnv:G}=await i_({payload:K,targetSkillName:u,projectRepoRoot:U,expectationsSourcePath:j,logger:y,collectedSkills:n,homeDir:f?.userHomeDir,requestLogFilePath:b});return Y("[PrepareEnv] ========== Iteration workspace created ==========",b),G}catch(u){throw Y(`[PrepareEnv] [ERROR] Failed to create iteration workspace: ${u}`,b),u}}import o_ from"fs";import Gc from"path";function g0(h){if(!h?.session)return h;if(typeof h.session.prompt==="function")return h;if(typeof h.session.promptAsync!=="function")return h;return{...h,session:{...h.session,prompt:(f,_)=>h.session.promptAsync({sessionID:f.path.id,parts:f.body?.parts??[],...f.body?.noReply!==void 0?{noReply:f.body.noReply}:{},...f.body&&"model"in f.body&&f.body.model!==void 0?{model:f.body.model}:{}},_)}}}function P0(h,f){return{sessionID:"",directory:h,evolveV3SkipStatusPrompt:f?.preferPrompt===!0?!1:!0,...f?.model?{model:f.model}:{}}}function k0(h,f,_){let n=h.abWorktrees.find((c)=>c.questionId===f&&c.comparisonRole===_);if(!n)throw Error(`Missing AB worktree for question ${f} (${_})`);return n.destPath}function l0(h,f,_,n){if(!o_.existsSync(_))return{records:[],concurrency:n};let b=o_.readFileSync(_,"utf-8").split(`
`).filter((J)=>J.trim()).map((J)=>JSON.parse(J)),y=[],u=`v${f.version}`,U=Gc.dirname(f.versionDir),$=Wf(h.skillName,h.isNew),j=$!==void 0?`v${$}`:"none";for(let J of f.questions){let K=b.filter((X)=>X.questionId===J.questionId);if(K.length<2)continue;let G=K.find((X)=>X.skillVariant===j||X.version==="baseline")??K[0],Z=K.find((X)=>X.skillVariant===u||X.version==="treatment"||X.version===u)??K.find((X)=>X.sessionId!==G.sessionId)??K[1],z=k0(f,J.questionId,"baseline"),W=k0(f,J.questionId,"treatment"),w=Gc.join(f.versionDir,"SKILL.md"),v=j==="none"?void 0:Gc.join(U,j);y.push({questionId:J.questionId,comparisonRole:"baseline",skillVariant:j,skillVersionDir:v,skillPath:j==="none"?void 0:Gc.join(v,"SKILL.md"),prompt:J.prompt,worktreePath:z,sessionId:G.sessionId}),y.push({questionId:J.questionId,comparisonRole:"treatment",skillVariant:u,skillVersionDir:f.versionDir,skillPath:w,prompt:J.prompt,worktreePath:W,sessionId:Z.sessionId})}return{records:y,concurrency:n}}function p0(h){return{sessionId:h.sessionId??"frontend-writeSkillMd",agent:"inline-skill-author",skillPath:h.skillMdPath,evidencePath:h.evidencePath}}function e0(h,f,_){let n=n_(f),c=r_(h.skillName);return{questionResults:f.questions.map((y)=>{let u=of(h.skillName,y.questionId,f.comparator),U=f.abTest?.records.find((j)=>j.questionId===y.questionId&&j.comparisonRole==="treatment")?.sessionId??"unknown",$=0;try{if(o_.existsSync(u)&&o_.statSync(u).isFile())$=o_.statSync(u).size}catch{$=0}return{questionId:y.questionId,analysisPath:u,sessionId:U,analysisFileBytes:$}}),summary:{sessionId:"frontend-runABAnalyzer-summary",historyPath:c,evidencePath:n.evidencePath},concurrency:_}}import s_ from"fs";import Z3 from"path";async function Wc(h,f,_,n){Y("[CLEANUP] Starting worktree and branch cleanup...",n),Y(`[evolve-v3][frontend][cleanup] Cleanup start: ${f.length*2} worktree slots (A/B per question)`,n);let c=Tf(h);Y(`[evolve-v3][frontend][cleanup] skillAbTestDir=${c}, repoPath=${_}`,n);let b=0,y=0;try{if(!_||f.length===0)Y("[CLEANUP] Skipping worktree/branch cleanup (missing repoPath or questionIds)",n),Y("[evolve-v3][frontend][cleanup] Skip worktree/branch cleanup: missing repoPath or questionIds",n);else for(let U of f){let $=Z3.join(c,U);for(let j of["A","B"]){let J=Z3.join($,j),K=ph(h,U,j);try{if(Y(`[CLEANUP] Deleting worktree: ${J}`,n),s_.existsSync(J))await qf(J,{repoPath:_});Y(`[CLEANUP] Deleting branch: ${K}`,n),await a_(_,K).catch(()=>{}),await a_(_,`eval-${U}-${j}`).catch(()=>{}),b++}catch(G){y++,Y(`[CLEANUP] Cleanup failed (questionId=${U}, suffix=${j}): ${G}`,n)}}}Y(`[CLEANUP] Cleanup finished: ok=${b}, failed=${y}`,n),Y(`[evolve-v3][frontend][cleanup] Cleanup done: ok=${b}, failed=${y}`,n);let u=Z3.join(c,"ab_sessions.jsonl");try{if(s_.existsSync(u))s_.writeFileSync(u,"","utf-8");Y(`[CLEANUP] Cleared ab_sessions.jsonl: ${u}`,n)}catch(U){let $=U instanceof Error?U.message:String(U);Y(`[CLEANUP] Failed to clear ab_sessions.jsonl: ${$}`,n)}}finally{try{if(s_.existsSync(c))s_.rmSync(c,{recursive:!0,force:!0}),Y(`[CLEANUP] Removed skill ABTestDir: ${c}`,n)}catch(u){let U=u instanceof Error?u.message:String(u);Y(`[CLEANUP] Remove skill ABTestDir failed: ${U}`,n)}}}async function a0(h,f){let _=f.logger;try{let n=zy({skillName:h.skillName,targetSource:h.targetSource,projectDir:h.publishProjectDir,homeDir:f.homeDir?.trim()||GY.homedir(),logger:_});if(!n.published){let c=n.reason?` reason=${n.reason}`:"",b=n.error?` error=${n.error}`:"";_?.info(`[publish] skipped ${h.skillName}${c}${b}`);return}try{let{initSkills:c}=await import("B:/~BUN/root/chunk-vg45nwat.js");await c(h.publishProjectDir),_?.info(`[publish] reloaded skills cache for ${h.publishProjectDir}`)}catch(c){let b=c instanceof Error?c.message:String(c);_?.error(`[publish] skill cache reload failed (non-fatal): ${b}`)}}catch(n){let c=n instanceof Error?n.message:String(n);_?.error(`[publish] failed to publish ${h.skillName} (non-fatal): ${c}`)}}function ZY(h){return{ownerPid:process.pid,ownerKind:"daemon",ownerSessionId:ty(),requestLogPath:h}}function XY(h,f){return{ownerPid:process.pid,ownerKind:"frontend",ownerSessionId:h.sessionID,requestLogPath:f}}function Th(h,f,_){_3(h,f,_)}function zY(h){try{let f=Uf();if(!f)return;if(h.skillName)f.bindSkillVersion(h.skillName,h.version);if(Nc({skillName:h.skillName,version:h.version,status:h.status,outcome:h.outcome}),h.skillName&&h.version!==void 0&&Number.isFinite(h.version))Fy({skillName:h.skillName,version:h.version,attemptId:f.attemptId,summary:f.toSummary()});Y(`[evolve-v3][observability] wrote ${f.primaryPath} status=${f.data.status} stages=${f.data.token_usage.byStage.length} totalMs=${f.data.time_consuming.totalMs}`,h.logContext)}catch(f){Y(`[evolve-v3][observability] finalize failed: ${f instanceof Error?f.message:String(f)}`,h.logContext)}}async function Zc(h,f,_={}){let n=iy(),c=ty(n);k_(c);let b=new Date,y=_.requestLogFilePath??W3(h.skillName,b),u=ZY(y),U=!1;try{return await fc(h.skillName,u),U=!0,await Gn({entry:"daemon",skillName:h.skillName},async()=>Dc(_.tokenBudget,async()=>{if(h.expectations=M_(h.expectations),_.skipExpectationsJsonAudit!==!0)jc(h,y);Y(`[evolve-v3] daemon evolution gate acquired: pid=${n}, gateKey=${c}`,y),Y(`[evolve-v3] Pipeline start for ${h.skillName}`,y);let{iterationEnv:$,versionNumber:j,previousVersion:J}=await Yc(h,y);Wn(h.skillName,j),Th(h.skillName,u,"workspace");let K=Vf(h.skillName),G=Jc(h,$,{versionNumber:j,previousVersion:J}),Z=h.expectations.map((Q)=>Q.project_path.trim()).find(Boolean)||h.projectDir.trim(),z=$.questions.map((Q)=>Q.questionId),W=_.server,w=!1,v,X;try{if(!W)W=await ey(X3(h,f,K)),w=!0,Y("[evolve-v3] Server started for evolveV3 pipeline",y);v=fb(W.client,void 0,(E)=>Y(E,y));let Q=g0(W.client);if(_.model)z3(_.model);let d=P0(h.projectDir,{preferPrompt:_.preferPrompt===!0,model:_.model});Y("[evolve-v3] Skill author: writeSkillMd",y),Th(h.skillName,u,"skill-author");let B=await G3(Q,{user_intention:h.intention},d,$,y,{waitOptions:_.waitOptions,model:_.model},h.logger);G.status="skill-authored",G.skillAuthor=p0(B);let N=g_(_.abSessionConcurrency);Y("[evolve-v3] AB: runABTest",y),Th(h.skillName,u,"ab-test"),await U3(Q,d,$,y,{abSessionConcurrency:_.abSessionConcurrency,waitOptions:_.waitOptions,model:_.model,tokenBudget:_.tokenBudget}),G.status="ab-tested",G.abTest=l0(h,G,$.abSessionsPath,N),Y("[evolve-v3] Comparator: runComparatorStage",y),G.comparator=H_({questions:Rn($),extEval:$.ext_eval,logger:h.logger,requestLogFilePath:y,abTestDir:K.abTestDir}),Y(`[evolve-v3] Comparator done: winner=${G.comparator.winner} (A/B=${Pf(G.comparator.winner)}) basis=${G.comparator.decisionBasis}`,y),Th(h.skillName,u,"comparator");let A=Ny(h.skillName,{candidateVersion:j,comparator:G.comparator,baselineSkillVersion:Wf(h.skillName,h.isNew)});Y(`[evolve-v3] Version pointer updated: head=${Ey(A.pointers.head)}`,y);let S=P_(_.analyzerConcurrency);return Y("[evolve-v3] Analysis: runABAnalyzer",y),Th(h.skillName,u,"analyzer"),await J3(Q,d,{skillName:$.skillName,version:$.version,questions:$.questions.map((E)=>({questionId:E.questionId,expectedBehavior:E.expectedBehavior,gradingCriteria:E.gradingCriteria})),abSessionsPath:$.abSessionsPath,comparator:G.comparator},y,{analyzerConcurrency:_.analyzerConcurrency,waitOptions:_.waitOptions,tokenBudget:_.tokenBudget,model:_.model}),G.status="analyzed",G.analysis=e0(h,G,S),await a0($,{logger:h.logger}),Y(`[evolve-v3] Pipeline completed for ${h.skillName} with status=${G.status}`,y),G}catch(Q){throw X=Q,Q}finally{let Q;if(X instanceof Error)Q=`${X.name}:${X.message}`;else if(X!=null)Q=String(X);else if(G.status!=="analyzed")Q=G.status;if(zY({skillName:h.skillName,version:j,logContext:y,status:G.status==="analyzed"?"completed":"failed",outcome:Q}),v?.(),await Uc(G,K),await Wc(h.skillName,z,Z,y),w&&W)Y("[evolve-v3] Closing owned server",y),await W.close()}}))}finally{if(U){try{Th(h.skillName,u,"cleanup")}catch($){Y(`[evolve-v3][daemon] Lock renew failed during cleanup: ${$ instanceof Error?$.message:String($)}`,y)}_c(h.skillName,u)}h_(c)}}function wY(){let h=WY.join(G_(),"skillEvolveConfig.json");try{if(r0.existsSync(h)){let f=JSON.parse(r0.readFileSync(h,"utf-8"));if(typeof f.evolve_v3_frontend_rounds==="number"&&f.evolve_v3_frontend_rounds>0)return f.evolve_v3_frontend_rounds}}catch{}return 1}var ff=wY();async function w3(h,f,_,n){let{client:c}=h,b=[],y=null,u="startup",U=new Date,$=t_({sessionId:_?.sessionID,requestStartAt:U}),j={requestLogFilePath:$,sessionId:_?.sessionID,requestStartAt:U},J=_.directory??"",K=XY(_,$),G,Z=_.evolutionGateSessionID?.trim()||_.sessionID,z=async(W)=>{await fc(W,K),G=W.trim(),Z0(Z,G)};try{Y(`[evolve-v3][frontend][pipeline] ========== EVOLVE_V3_START ========== requestLogFilePath=${$}, sessionId=${_?.sessionID??"unknown"}, requestStartAt=${U.toISOString()}`,j);let W=I();Y(`[evolve-v3][frontend][pipeline] FrontEnd Pipeline start; evolveRoot=${W}, projectDir=${J}, rounds=${ff}`,j),Y(`[evolve-v3][frontend][pipeline] Entry context:
${Jh({sessionID:_?.sessionID,directory:_?.directory,user_intention:f?.user_intention,extraContext:_?.extraContext,rounds:ff})}`,j);let w={abSessionConcurrency:c3,waitOptions:{},model:_.model},v={analyzerConcurrency:y3,waitOptions:{}};for(let d=1;d<=ff;d++)await Gn({entry:"frontend"},async()=>{Y(`[EvolveV3] ========== ROUND ${d}/${ff} ==========`,j),Y(`[evolve-v3][frontend][pipeline] Starting round ${d}/${ff}`,j);let B=[];u="Step1 analyze user requirements",Y("[evolve-v3][frontend][pipeline] Step1 analyzeUserRequirements start",j),await n?.onStageStart?.("\u751F\u6210\u6D4B\u8BC4\u96C6",d);let N=await w0(c,f,_,J,$,{acquireSkillLockAfterParse:z}),A=N.targetSkillName,S=N.collectedSkills;Y(`[evolve-v3][frontend][pipeline] Step1 completed; targetSkill=${A}`,j),await n?.onStageComplete?.("\u751F\u6210\u6D4B\u8BC4\u96C6",d,`\u9700\u6C42\u5206\u6790\u5B8C\u6210: ${A}`),u="Step2 create iteration workspace",Y("[evolve-v3][frontend][pipeline] Step2 adaptIterationEnvironmentForPlugin start",j),await n?.onStageStart?.("\u521B\u5EFA\u8FDB\u5316\u5DE5\u4F5C\u7A7A\u95F4",d),y=await Kc(c,_,A,S,$);let E=Number.parseInt(y.version.replace(/^v/,""),10);Wn(y.skillName,Number.isFinite(E)?E:void 0),Th(y.skillName,K,"workspace"),B.push(...y.questions.map((M)=>M.questionId)),b.push(...B);let F=Vf(y.skillName);Y(`[evolve-v3][frontend][pipeline] Step2 iteration environment: skill=${y.skillName}, version=${y.version}, questionCount=${B.length}, evolveRootDir=${F.evolveRootDir}, skillWorkspace=${F.skillWorkspaceDir}, abTestDir=${F.abTestDir}`,j),Y(`[evolve-v3][frontend][pipeline] Step2 env detail:
${Jh({round:d,skillName:y.skillName,isNew:y.isNew,version:y.version,versionDir:y.versionDir,skillSpaceDir:y.skillSpaceDir,abSessionsPath:y.abSessionsPath,questionCount:y.questions?.length??0,questionIds:B})}`,j),Y("[evolve-v3][frontend][pipeline] Step2 completed; status=workspace-prepared",j),await n?.onStageComplete?.("\u521B\u5EFA\u8FDB\u5316\u5DE5\u4F5C\u7A7A\u95F4",d,`\u8FDB\u5316\u5DE5\u4F5C\u7A7A\u95F4\u5DF2\u5C31\u7EEA: ${y.skillName}/${y.version}`),u="Step3 write SKILL.md",Y("[evolve-v3][frontend][pipeline] Step3 writeSkillMd start",j),Th(y.skillName,K,"skill-author"),await n?.onStageStart?.("\u751F\u6210\u6280\u80FD",d);let O=await G3(c,f,_,y,$,{waitOptions:w.waitOptions});Y(`[evolve-v3][frontend][pipeline] Step3 completed; skillMdPath=${O.skillMdPath}, evidencePath=${O.evidencePath}`,j),await n?.onStageComplete?.("\u751F\u6210\u6280\u80FD",d,`\u6280\u80FD\u5DF2\u751F\u6210: ${O.skillMdPath}`),u="Step4 run AB tests",Y("[evolve-v3][frontend][pipeline] Step4 runABTest start; execution=parallel",j),Th(y.skillName,K,"ab-test"),await n?.onStageStart?.("\u8FD0\u884CAB\u6D4B\u8BD5",d);let q=await U3(c,_,y,$,w);Y(`[evolve-v3][frontend][pipeline] Step4 completed; sessionResults=${q.sessionResults.length}, failedCount=${q.failedCount}`,j),await n?.onStageComplete?.("\u8FD0\u884CAB\u6D4B\u8BD5",d,`AB\u6D4B\u8BD5\u5B8C\u6210: ${q.sessionResults.length} \u4F1A\u8BDD, ${q.failedCount} \u5931\u8D25`),u="Step4b run AB comparator",Y("[evolve-v3][frontend][pipeline] Step4b comparator start",j);let m=H_({questions:Rn(y),extEval:y.ext_eval,requestLogFilePath:$,abTestDir:F.abTestDir});Y(`[evolve-v3][frontend][pipeline] Step4b comparator done: winner=${m.winner} (side ${Pf(m.winner)}), basis=${m.decisionBasis}, baseline passRate=${m.baselineAggregate.passRate}, treatment passRate=${m.treatmentAggregate.passRate}`,j),Th(y.skillName,K,"comparator");let P=Number.parseInt(y.version.replace(/^v/,""),10),H=Ny(y.skillName,{candidateVersion:P,comparator:m,baselineSkillVersion:Wf(y.skillName,y.isNew)});Y(`[evolve-v3][frontend][pipeline] Version pointer head=${Ey(H.pointers.head)}`,j),u="Step5 run AB analysis",Y("[evolve-v3][frontend][pipeline] Step5 runABAnalyzer start",j),await n?.onStageStart?.("\u5206\u6790AB\u6D4B\u8BD5\u7ED3\u679C",d);let C={skillName:y.skillName,version:y.version,questions:y.questions.map((M)=>({questionId:M.questionId,expectedBehavior:M.expectedBehavior,gradingCriteria:M.gradingCriteria})),abSessionsPath:y.abSessionsPath,comparator:m};Y(`[evolve-v3][frontend][pipeline] Analyzer config:
${Jh(C)}`,j),Th(y.skillName,K,"analyzer");let T=await J3(c,_,C,$,v);Y(`[evolve-v3][frontend][pipeline] Step5 completed; analysisResultsPath=${T.analysisResultsPath}`,j),await n?.onStageComplete?.("\u5206\u6790AB\u6D4B\u8BD5\u7ED3\u679C",d,`\u5206\u6790\u5B8C\u6210: ${T.analysisResultsPath}`),Y(`[evolve-v3][frontend][pipeline] Round ${d}/${ff} completed; cleaning AB sandbox`,j),await Wc(y.skillName,B,J,$),Y(`[evolve-v3][frontend][pipeline] Round ${d}/${ff} cleanup finished`,j)});if(y)await a0(y,{homeDir:_.userHomeDir});let X=y?`[publish] done for ${y.skillName}`:"[publish] skipped (no iteration env)";Y(`[evolve-v3][frontend][pipeline] ${X}`,j),Y(`[evolve-v3][frontend][pipeline] ========== EVOLVE_V3_SUCCESS ========== Pipeline completed for ${y?.skillName??"unknown"} after ${ff} round(s)`,j);let Q=`Tool completed - evolveV3 workflow finished (${ff} round(s)), iteration environment cleaned, no further analysis or actions required`;return await n?.onPipelineComplete?.(Q),Q}catch(W){if(W instanceof Ph)throw W;let w=W instanceof Error?W.message:String(W),v=W instanceof Error?W.stack:"";if(Y(`[evolve-v3][frontend][pipeline] [ERROR] evolveV3 failed at ${u}: ${w}`,j),v)Y(`[evolve-v3][frontend][pipeline] [ERROR] stack: ${v}`,j);return await n?.onPipelineError?.(u,w),[`Tool stopped - evolveV3 workflow failed at ${u}.`,`Reason: ${w}`,y?`Current skill: ${y.skillName}/${y.version}`:"Current skill: not resolved",y?.versionDir?`Version directory: ${y.versionDir}`:void 0,`Request log: ${$}`].filter(Boolean).join(`
`)}finally{if(G){try{Th(G,K,"cleanup")}catch(W){Y(`[evolve-v3][frontend] Lock renew failed during cleanup: ${W instanceof Error?W.message:String(W)}`,j)}_c(G,K)}Y(`[evolve-v3][frontend][pipeline] Cleanup start: questionIds=${b.length}`,j);try{let W=y?.skillName;if(W&&b.length>0)await Wc(W,b,J,$);Y("[evolve-v3][frontend][pipeline] Cleanup finished",j)}catch(W){let w=W instanceof Error?W.message:String(W);Y(`[EvolveV3] [ERROR] Cleanup failed: ${w}`,j)}Y("[EvolveV3] evolveV3 finished",j)}}import{promises as Xc}from"fs";import AY from"os";import TY from"path";var i={batchSize:3,roundsPerRun:1,minIntervalMinutes:30,checkIntervalMinutes:1,dbPath:"",evolveDir:"",logLevel:"info",webserverPath:"",minimumTrajectories:1,port:0,sessionActiveMinutes:10,whenToRun:"night",nightStartHour:0,nightEndHour:8,stopAutoTask:!1,mode:"opencode",auth:py,maxTokensPerScheduleWindow:2000000,budgetAwareScheduling:!0,budgetEstimateSafetyMargin:1.1,budgetEstimatePercentile:0.75,maxSamplesPerSkill:10,maxEvolutionsPerSkillPerWindow:1,skillCoverageDecayPerHour:0.5,tokensPerQuestionFallback:80000,budgetUnderestimateInflation:1.15};function i0(h){let f=typeof h==="number"?h:Number(h);if(!Number.isFinite(f)||f<1)return i.roundsPerRun;return Math.floor(f)}function t0(){return TY.join(AY.homedir(),".local","share","opencode","opencode.db")}async function xY(){let h=rh(),f=await Xc.access(h).then(()=>!0).catch(()=>!1),_=hn();if(!f)return{config:await CY(_),mode:_};return{config:await qY(_),mode:_}}async function CY(h){let f={...i,dbPath:h.dbPath||t0(),evolveDir:I(),webserverPath:"",mode:h.type};return await MY(f),f}async function qY(h){let f=await Xc.readFile(rh(),"utf8"),_=_f.load(f);return{...i,batchSize:_.batchSize??i.batchSize,roundsPerRun:i0(_.roundsPerRun??i.roundsPerRun),minIntervalMinutes:_.minIntervalMinutes??i.minIntervalMinutes,checkIntervalMinutes:_.checkIntervalMinutes??i.checkIntervalMinutes,logLevel:_.logLevel??i.logLevel,minimumTrajectories:_.minimumTrajectories??i.minimumTrajectories,sessionActiveMinutes:_.sessionActiveMinutes??i.sessionActiveMinutes,whenToRun:_.whenToRun??i.whenToRun,nightStartHour:_.nightStartHour??i.nightStartHour,nightEndHour:_.nightEndHour??i.nightEndHour,dbPath:_.dbPath||h.dbPath||t0(),evolveDir:_.evolveDir||I(),webserverPath:"",mode:h.type,model:_.model?.providerID&&_.model?.modelID?_.model:void 0,auth:void 0,port:_.port??i.port,stopAutoTask:!1,maxTokensPerScheduleWindow:_.maxTokensPerScheduleWindow??i.maxTokensPerScheduleWindow,budgetAwareScheduling:_.budgetAwareScheduling??i.budgetAwareScheduling,budgetEstimateSafetyMargin:_.budgetEstimateSafetyMargin??i.budgetEstimateSafetyMargin,budgetEstimatePercentile:_.budgetEstimatePercentile??i.budgetEstimatePercentile,maxSamplesPerSkill:_.maxSamplesPerSkill??i.maxSamplesPerSkill,maxEvolutionsPerSkillPerWindow:_.maxEvolutionsPerSkillPerWindow??i.maxEvolutionsPerSkillPerWindow,skillCoverageDecayPerHour:_.skillCoverageDecayPerHour??i.skillCoverageDecayPerHour,tokensPerQuestionFallback:_.tokensPerQuestionFallback??i.tokensPerQuestionFallback,budgetUnderestimateInflation:_.budgetUnderestimateInflation??i.budgetUnderestimateInflation}}function VY(h){let f={batchSize:h.batchSize,roundsPerRun:h.roundsPerRun,minIntervalMinutes:h.minIntervalMinutes,checkIntervalMinutes:h.checkIntervalMinutes,logLevel:h.logLevel,dbPath:h.dbPath,evolveDir:h.evolveDir,minimumTrajectories:h.minimumTrajectories,sessionActiveMinutes:h.sessionActiveMinutes,whenToRun:h.whenToRun,nightStartHour:h.nightStartHour,nightEndHour:h.nightEndHour,stopAutoTask:h.stopAutoTask,mode:h.mode,port:h.port,maxTokensPerScheduleWindow:h.maxTokensPerScheduleWindow,budgetAwareScheduling:h.budgetAwareScheduling,budgetEstimateSafetyMargin:h.budgetEstimateSafetyMargin,budgetEstimatePercentile:h.budgetEstimatePercentile,maxSamplesPerSkill:h.maxSamplesPerSkill,maxEvolutionsPerSkillPerWindow:h.maxEvolutionsPerSkillPerWindow,skillCoverageDecayPerHour:h.skillCoverageDecayPerHour,tokensPerQuestionFallback:h.tokensPerQuestionFallback,budgetUnderestimateInflation:h.budgetUnderestimateInflation};if(h.model)f.model=h.model;return f}async function MY(h){let f=rh(),_={},n=await Xc.readFile(f,"utf8").catch((c)=>{if(c&&typeof c==="object"&&"code"in c&&c.code==="ENOENT")return"";throw c});if(n.trim()){let c=_f.load(n);if(c&&typeof c==="object"&&!Array.isArray(c))_=c}Object.assign(_,VY(h)),await Xc.writeFile(f,_f.dump(_,{indent:2}),"utf8")}function EY(h){return{dbPath:h.dbPath,evolveDir:h.evolveDir,batchSize:h.batchSize,roundsPerRun:i0(h.roundsPerRun),minIntervalMs:h.minIntervalMinutes*60*1000,checkIntervalMs:h.checkIntervalMinutes*60*1000,logLevel:h.logLevel,webserverPath:"",minimumTrajectories:h.minimumTrajectories,sessionActiveMs:h.sessionActiveMinutes*60*1000,whenToRun:h.whenToRun,nightStartHour:h.nightStartHour,nightEndHour:h.nightEndHour,auth:h.auth,mode:h.mode,stopAutoTask:h.stopAutoTask,model:h.model,maxTokensPerScheduleWindow:h.maxTokensPerScheduleWindow,budgetAwareScheduling:h.budgetAwareScheduling,budgetEstimateSafetyMargin:h.budgetEstimateSafetyMargin,budgetEstimatePercentile:h.budgetEstimatePercentile,maxSamplesPerSkill:h.maxSamplesPerSkill,maxEvolutionsPerSkillPerWindow:h.maxEvolutionsPerSkillPerWindow,skillCoverageDecayPerHour:h.skillCoverageDecayPerHour,tokensPerQuestionFallback:h.tokensPerQuestionFallback,budgetUnderestimateInflation:h.budgetUnderestimateInflation}}class fn{_config;async getLatest(h){try{let f=await xY(),_=EY(f.config);if(h&&this._config&&_.batchSize!==this._config.batchSize)h.log("info",`Config hot-reloaded: batch=${_.batchSize}`);return this._config=_,{config:_,mode:f.mode}}catch(f){if(this._config){h?.log("error",`Config reload failed, falling back to cached config: ${f}`);let _=hn();return{config:this._config,mode:_}}throw f}}}import nf from"fs";var RY=5242880,o0=5;function y_(h){let f=s0();return Lh(I()),{log(_,n){if(_==="debug"&&h!=="debug")return;try{if(nf.existsSync(f)&&nf.statSync(f).size>RY)this.rotate()}catch(c){console.debug("Failed to check log size:",c)}nf.appendFileSync(f,`[${new Date().toISOString()}] [${_}] ${n}
`,"utf8")},rotate(){if(!nf.existsSync(f))return;for(let _=o0-1;_>=1;_--){let n=`${f}.${_}`,c=`${f}.${_+1}`;if(nf.existsSync(n))if(_===o0-1)nf.unlinkSync(n);else nf.renameSync(n,c)}nf.renameSync(f,`${f}.1`),nf.writeFileSync(f,"","utf8")},getLogPath(){return f}}}import{Database as kY}from"bun:sqlite";import{existsSync as gY,promises as PY}from"fs";import Q3 from"fs";class v3{config;logger;mode;constructor(h,f,_){this.config=h,this.logger=f,this.mode=_}createEvolveLogger(h){return{info:(f)=>{},error:(f)=>h.log("error",f),debug:(f)=>{}}}collectCurrentTasks(h){return h1().map((n)=>({skillName:n,expectationsJsonlPath:_1(n),skillEvolveRootPath:nh(n),skillPath:n1(n,h)})).sort((n,c)=>n.skillName.localeCompare(c.skillName))}readExpectationsQuestionCount(h){return this.readExpectationsJson(h).expectations.length}async runEvolveV3ForTasks(h,f,_={}){let n=[],c=0,b=0,y=0,u=this.createEvolveLogger(this.logger);for(let U of h){if(_.tokenBudget?.isExceeded()){this.logger.log("info",`V3 task skipped for ${U.skillName} (token budget exhausted for window)`),b+=1;continue}try{let{isNew:$,intention:j,expectations:J,ext_eval:K,targetSource:G}=this.readExpectationsJson(U),Z={dbPath:this.config.dbPath,webserverPath:this.config.webserverPath,logger:u,projectDir:U.skillEvolveRootPath,skillPath:U.skillPath,model:this.config.model,auth:this.config.auth,skillName:U.skillName,expectationsJsonlPath:U.expectationsJsonlPath,skillEvolveRootPath:U.skillEvolveRootPath,isNew:$,intention:j,expectations:J,...K!==void 0?{ext_eval:K}:{},...G!==void 0?{targetSource:G}:{},mode:this.mode.type},z={...f,model:f?.model??this.config.model,tokenBudget:_.tokenBudget??f?.tokenBudget},W=await Zc(Z,this.mode,z);if(n.push(W),W.status==="analyzed"&&W.analysis){let w=W.versionDir?.match(/v(\d+)$/),v=w?Number(w[1]):0,X=SY({versionDir:W.versionDir,skillName:U.skillName,version:v});_.onSkillSuccess?.({skillName:U.skillName,totalTokens:X,questionCount:J.length,version:v}),this.logger.log("info",`V3 analysis completed for ${U.skillName}: ${W.analysis.questionResults.length} question results, evidence: ${W.analysis.summary.evidencePath}`)}else if(W.abTest)this.logger.log("info",`V3 AB test completed for ${U.skillName}: ${W.abTest.records.length} session records`);else if(W.skillAuthor)this.logger.log("info",`V3 skill authored for ${U.skillName}: ${W.skillAuthor.skillPath}, evidence: ${W.skillAuthor.evidencePath}`);else this.logger.log("info",`V3 workspace prepared for ${U.skillName}: ${W.versionDir}`)}catch($){if($ instanceof Ph){b+=1,this.logger.log("info",`V3 task skipped for ${U.skillName} (skill evolution lock held): ${$.message}`);continue}if($ instanceof Vh){y+=1,_.onBudgetExceeded?.({skillName:U.skillName}),this.logger.log("info",`V3 task stopped for ${U.skillName} (token budget exceeded): ${$.message}`);break}c+=1,this.logger.log("error",`V3 task failed for ${U.skillName}: ${$ instanceof Error?$.message:String($)}`)}}return{processed:n.length,failed:c,skipped:b,budgetExceeded:y,results:n}}readExpectationsJson(h){let f=f1(h.expectationsJsonlPath,h.skillName),_=Q3.readFileSync(f,"utf-8"),n=JSON.parse(_),c=E_(n);if(!c.targetSource){let b=c.expectations.map((y)=>y.project_path.trim()).find(Boolean)??process.cwd();c.targetSource=af(f,{skillName:h.skillName,isNew:c.isNew,projectDir:b})}return c}}function SY(h){let{versionDir:f,skillName:_,version:n}=h;if(_&&n!=null&&Number.isFinite(n))try{let y=Ly(_).versions[String(n)]?.metrics?.extensions?.observabilityAttemptId;if(typeof y==="string"&&y.trim()){let U=Ic(y,f)?.token_usage?.total;if(U)return vf(U)}}catch{}if(!f)return 0;let c=c1(f);if(!Q3.existsSync(c))return 0;try{let y=JSON.parse(Q3.readFileSync(c,"utf-8")).token_usage?.total;return y?vf(y):0}catch{return 0}}import xh from"fs";import Ch from"path";function $1(){let h=Ch.join(I(),"state");return Lh(h),h}function DY(h){return Ch.join(h,"observability.json")}function LY(){return Ch.join(I(),"observability")}function mY(h){return Ch.join(I(),"skill_evolution_workspace",`${h}_evolution_space`)}var NY="skill-evolution-stats.json";function U1(){return Ch.join($1(),NY)}function y1(){return{schemaVersion:1,global:{p75ByQuestionCount:{}},skills:{}}}function _n(){let h=U1();if(!xh.existsSync(h))return y1();try{let f=JSON.parse(xh.readFileSync(h,"utf-8"));return{schemaVersion:1,global:{p75ByQuestionCount:f.global?.p75ByQuestionCount??{}},skills:f.skills??{}}}catch{return y1()}}function zc(h){let f=U1();Lh(Ch.dirname(f)),xh.writeFileSync(f,`${JSON.stringify(h,null,2)}
`,"utf-8")}function H3(h,f){if(h.length===0)return 0;let _=[...h].sort((c,b)=>c-b),n=Math.min(_.length-1,Math.max(0,Math.ceil(f*_.length)-1));return _[n]}function b1(h){return H3(h,0.5)}function j1(h){let f={};for(let n of Object.values(h.skills))for(let c of n.samples){let b=String(c.questionCount);if(!f[b])f[b]=[];f[b].push(c.totalTokens)}let _={};for(let[n,c]of Object.entries(f))if(c.length>=3)_[n]=H3(c,0.75);h.global.p75ByQuestionCount=_}function Y1(h){let f=_n(),_=h.config.maxSamplesPerSkill??10;if(!f.skills[h.skillName])f.skills[h.skillName]={evolvedInWindowCount:0,underestimateStreak:0,samples:[]};let n=f.skills[h.skillName];if(n.samples.push({at:new Date().toISOString(),totalTokens:h.totalTokens,questionCount:h.questionCount,version:h.version}),n.samples.length>_)n.samples=n.samples.slice(-_);if(n.lastWindowId===h.windowId)n.evolvedInWindowCount=(n.evolvedInWindowCount??0)+1;else n.evolvedInWindowCount=1;return n.lastEvolvedAt=new Date().toISOString(),n.lastWindowId=h.windowId,j1(f),zc(f),console.log(`[evolve-audit] planner.sample_ingested ${JSON.stringify({skillName:h.skillName,totalTokens:h.totalTokens,questionCount:h.questionCount,version:h.version,sampleCount:n.samples.length,source:"observability"})}`),f}function J1(h,f,_,n){let c=_n();if(!c.skills[h])return;let b=c.skills[h];if(_>f)b.underestimateStreak=(b.underestimateStreak??0)+1;else b.underestimateStreak=0;let y=Math.min(1.3,Math.pow(n.budgetUnderestimateInflation??1.15,b.underestimateStreak));console.log(`[evolve-audit] planner.underestimate ${JSON.stringify({skillName:h,estimated:f,actual:_,underestimateStreak:b.underestimateStreak,newInflation:y})}`),zc(c)}function K1(h,f,_,n){let c=_.skills[h.skillName],b=n.budgetEstimateSafetyMargin??1.1,y=c?.underestimateStreak?Math.min(1.3,Math.pow(n.budgetUnderestimateInflation??1.15,c.underestimateStreak)):1,u=f,U=0,$="fallback_linear",j="low",J=c?.samples.filter((G)=>G.questionCount===u)??[];if(J.length>=2)U=H3(J.map((G)=>G.totalTokens),n.budgetEstimatePercentile??0.75),$="same_q_p75",j=J.length>=3?"high":"medium";else if(c&&c.samples.length>=2){let G=c.samples.map((z)=>z.totalTokens),Z=b1(c.samples.map((z)=>z.questionCount))||u;U=b1(G)*(u/Z),$="scaled_median",j="medium"}else if(c?.samples.length===1){let G=c.samples[0];U=G.totalTokens*(u/(G.questionCount||1)),$="single_scaled",j="low"}else{let G=_.global.p75ByQuestionCount[String(u)];if(G!==void 0)U=G,$="global_q_p75",j="medium";else U=u*(n.tokensPerQuestionFallback??80000),$="fallback_linear",j="low"}let K=Math.ceil(U*b*y);return console.log(`[evolve-audit] planner.estimate ${JSON.stringify({skillName:h.skillName,questionCount:u,estimate:K,method:$,confidence:j,safetyMargin:b,personalInflation:y})}`),{estimate:K,method:$,confidence:j}}function G1(h){let f=_n(),_=0,n=0,c=Ch.dirname($1()),b=Ch.join(c,"skill_evolution_workspace");if(!xh.existsSync(b))return zc(f),{skillsScanned:_,samplesImported:n};for(let y of xh.readdirSync(b,{withFileTypes:!0})){if(!y.isDirectory()||!y.name.endsWith("_evolution_space"))continue;let u=y.name.replace(/_evolution_space$/,"");_++;let U=mY(u),$=xh.readdirSync(U,{withFileTypes:!0}).filter((J)=>J.isDirectory()&&/^v\d+$/.test(J.name)).map((J)=>Number(J.name.slice(1))).sort((J,K)=>K-J);for(let J of $.slice(0,3)){let K=DY(Ch.join(U,`v${J}`));if(u1(f,u,J,K))n++}let j=Ch.join(LY(),"by-skill",u.replace(/[^a-zA-Z0-9_.-]+/g,"_").slice(0,120));if(xh.existsSync(j)){let J=xh.readdirSync(j).filter((K)=>K.endsWith(".json")).map((K)=>({name:K,mtime:xh.statSync(Ch.join(j,K)).mtimeMs})).sort((K,G)=>G.mtime-K.mtime).slice(0,3);for(let K of J){let G=Ch.join(j,K.name);try{let Z=JSON.parse(xh.readFileSync(G,"utf-8")),z=Z.candidateVersion??Z.version??0;if(u1(f,u,z,G))n++}catch{}}}}return j1(f),zc(f),console.log(`[evolve-audit] planner.bootstrap ${JSON.stringify({skillsScanned:_,samplesImported:n,globalBucketsUpdated:Object.keys(f.global.p75ByQuestionCount).length})}`),{skillsScanned:_,samplesImported:n}}function u1(h,f,_,n){if(!xh.existsSync(n))return!1;try{let b=JSON.parse(xh.readFileSync(n,"utf-8")).token_usage?.total;if(!b)return!1;let y=vf(b);if(!h.skills[f])h.skills[f]={evolvedInWindowCount:0,underestimateStreak:0,samples:[]};if(h.skills[f].samples.some((U)=>U.version===_&&U.totalTokens===y))return!1;return h.skills[f].samples.push({at:new Date().toISOString(),totalTokens:y,questionCount:0,version:_}),!0}catch{return!1}}function W1(h){return{budgetAwareScheduling:h.budgetAwareScheduling??!0,budgetEstimateSafetyMargin:h.budgetEstimateSafetyMargin??1.1,budgetEstimatePercentile:h.budgetEstimatePercentile??0.75,maxSamplesPerSkill:h.maxSamplesPerSkill??10,maxEvolutionsPerSkillPerWindow:h.maxEvolutionsPerSkillPerWindow??1,skillCoverageDecayPerHour:h.skillCoverageDecayPerHour??0.5,tokensPerQuestionFallback:h.tokensPerQuestionFallback??80000,budgetUnderestimateInflation:h.budgetUnderestimateInflation??1.15}}function Z1(h,f,_){let n=_.skills[h];if(!n)return 0;if(n.lastWindowId!==f)return 0;return n.evolvedInWindowCount??0}function X1(h){if(!h)return Number.POSITIVE_INFINITY;return(Date.now()-new Date(h).getTime())/3600000}function z1(h,f,_,n,c){let b=W1(n);if(console.log(`[evolve-audit] planner.start ${JSON.stringify({windowId:f.windowId,remaining:f.remaining,candidateCount:h.length,budgetAwareScheduling:b.budgetAwareScheduling})}`),!b.budgetAwareScheduling){let J=[...h].sort((K,G)=>K.skillName.localeCompare(G.skillName));return{planned:J,deferred:[],report:{planned:J.map((K)=>({skillName:K.skillName,estimate:0,method:"alphabetical"})),deferred:[],plannedTotalEstimate:0}}}let y=[],u=[];for(let J of h){let K=Z1(J.skillName,f.windowId,_);if(K>=b.maxEvolutionsPerSkillPerWindow){console.log(`[evolve-audit] planner.deferred ${JSON.stringify({skillName:J.skillName,reason:"window_cap"})}`),y.push(J);continue}let G=c.get(J.skillName)??0,{estimate:Z,method:z}=K1(J,G,_,n);if(f.remaining>0&&Z>f.remaining){console.log(`[evolve-audit] planner.deferred ${JSON.stringify({skillName:J.skillName,reason:"estimate_exceeds_remaining",estimate:Z,remaining:f.remaining})}`),y.push(J);continue}let W=_.skills[J.skillName],v=(!W?.lastEvolvedAt?100:0)+X1(W?.lastEvolvedAt)*b.skillCoverageDecayPerHour-K*10;u.push({...J,estimate:Z,method:z,coverageScore:v})}u.sort((J,K)=>{if(K.coverageScore!==J.coverageScore)return K.coverageScore-J.coverageScore;return J.estimate-K.estimate});let U=[],$=0;for(let J of u){if(f.remaining>0&&$+J.estimate>f.remaining){y.push(J);continue}U.push(J),$+=J.estimate}let j={planned:U.map((J)=>({skillName:J.skillName,estimate:J.estimate,method:J.method})),deferred:y.map((J)=>({skillName:J.skillName,reason:"deferred_by_planner"})),plannedTotalEstimate:$};return console.log(`[evolve-audit] planner.result ${JSON.stringify({planned:j.planned,deferred:j.deferred.map((J)=>J.skillName),plannedTotalEstimate:j.plannedTotalEstimate,remaining:f.remaining,plannedCount:U.length})}`),{planned:U.map(({skillName:J,expectationsJsonlPath:K,skillEvolveRootPath:G,skillPath:Z})=>({skillName:J,expectationsJsonlPath:K,skillEvolveRootPath:G,skillPath:Z})),deferred:y,report:j}}function w1(h,f){let _=new Map;for(let n of h)_.set(n.skillName,f(n));return _}import O3 from"fs";import B3 from"path";var FY="token-budget.json";function IY(){let h=B3.join(I(),"state");return Lh(h),h}function Q1(){return B3.join(IY(),FY)}function Mf(h,f=new Date){if(h.whenToRun==="night"){let b=f.getFullYear(),y=String(f.getMonth()+1).padStart(2,"0"),u=String(f.getDate()).padStart(2,"0");return`${b}-${y}-${u}_${h.nightStartHour}-${h.nightEndHour}`}let _=f.getFullYear(),n=String(f.getMonth()+1).padStart(2,"0"),c=String(f.getDate()).padStart(2,"0");return`${_}-${n}-${c}`}function d3(h,f){return{schemaVersion:1,windowId:h,consumed:0,subagentCallCount:0,maxTokens:f,updatedAt:new Date().toISOString()}}function nn(h){let f=h.maxTokensPerScheduleWindow??0,_=Mf(h),n=Q1();if(!O3.existsSync(n))return d3(_,f);try{let c=JSON.parse(O3.readFileSync(n,"utf-8"));if(c.windowId!==_)return d3(_,f);return{schemaVersion:1,windowId:_,consumed:typeof c.consumed==="number"?c.consumed:0,subagentCallCount:typeof c.subagentCallCount==="number"?c.subagentCallCount:0,maxTokens:f,updatedAt:c.updatedAt??new Date().toISOString()}}catch{return d3(_,f)}}function A3(h){let f=h.toState(),_=Q1();Lh(B3.dirname(_));let n={schemaVersion:1,...f,updatedAt:new Date().toISOString()};O3.writeFileSync(_,`${JSON.stringify(n,null,2)}
`,"utf-8"),console.debug(`[evolve-audit] budget.state_saved ${JSON.stringify({path:_,windowId:f.windowId,consumed:f.consumed})}`)}function v1(h){let f=h.maxTokensPerScheduleWindow??0,_=nn(h),n=new Jn(f,_);return Vc(n,_.windowId!==Mf(h)),n}function wc(h){return(h.maxTokensPerScheduleWindow??0)>0}function H1(h){if(!wc(h))return!1;let f=nn(h);return f.consumed>=f.maxTokens}async function d1(h,f,_){let n=y_(h.logLevel),c=new v3(h,n,f);G1(h);let b=c.collectCurrentTasks(process.cwd()),y=_.skills&&_.skills.length>0?b.filter((z)=>_.skills.includes(z.skillName)):b;if(y.length===0){n.log("info","No V3 evolve tasks found");return}let u=v1(h),U=Mf(h),$=w1(y,(z)=>c.readExpectationsQuestionCount(z)),j=_n(),{planned:J,report:K}=z1(y,{remaining:u.remaining,windowId:U},j,h,$);if(J.length===0){n.log("info",`All ${y.length} V3 task(s) deferred by budget planner (deferred=${y.length-J.length})`),A3(u);return}if(n.log("info",`Found ${y.length} V3 evolve tasks; planned=${J.length} deferred=${y.length-J.length}`),K.plannedTotalEstimate>0)n.log("info",`Planner estimated tokens: ${K.plannedTotalEstimate}`);let G=new Map(K.planned.map((z)=>[z.skillName,z.estimate])),Z=h.roundsPerRun;for(let z=1;z<=Z;z++){n.log("info",`Starting V3 round ${z}/${Z}`);let W=await c.runEvolveV3ForTasks(J,_.runtime,{tokenBudget:u,onSkillSuccess:({skillName:w,totalTokens:v,questionCount:X,version:Q})=>{Y1({skillName:w,totalTokens:v,questionCount:X,version:Q,windowId:U,config:h}),n.log("info",`[evolve-audit] budget.skill_summary ${JSON.stringify({skillName:w,actualTokensThisRun:v,rolledBack:!1,windowConsumedAfter:u.totalConsumed})}`)},onBudgetExceeded:({skillName:w})=>{let v=G.get(w);if(v!==void 0)J1(w,v,u.totalConsumed,h);n.log("info",`[evolve-audit] budget.skill_summary ${JSON.stringify({skillName:w,actualTokensThisRun:u.totalConsumed,rolledBack:!0,windowConsumedAfter:u.totalConsumed})}`)}});n.log("info",`V3 round ${z}/${Z}: processed=${W.processed}, failed=${W.failed}, skipped=${W.skipped}, budgetExceeded=${W.budgetExceeded}`)}A3(u)}var B1=900000;function O1(h){switch(h){case"time-window":return"Time window gate";case"session-activity":return"Session activity gate";case"token-budget":return"Token budget gate";default:return"Unknown gate"}}class T3{logger;heartbeatMs;now;lastSignature=new Map;sinceChangeAt=new Map;lastLogAt=new Map;pollsSinceChange=new Map;constructor(h,f=900000,_=()=>Date.now()){this.logger=h;this.heartbeatMs=f;this.now=_}emit(h,f,_){let n=`${f}|${_}`,c=this.now();if(this.lastSignature.get(h)!==n){this.lastSignature.set(h,n),this.sinceChangeAt.set(h,c),this.lastLogAt.set(h,c),this.pollsSinceChange.set(h,1),this.logger.log("info",`${O1(h)}: ${f} (${_})`);return}let y=(this.pollsSinceChange.get(h)??0)+1;this.pollsSinceChange.set(h,y);let u=this.lastLogAt.get(h)??0;if(c-u<this.heartbeatMs)return;this.lastLogAt.set(h,c);let U=this.sinceChangeAt.get(h)??c,$=Math.max(1,Math.floor((c-U)/60000)),j=$<60?`${$}m`:`${Math.floor($/60)}h${$%60}m`;this.logger.log("info",`${O1(h)}: still ${f} (unchangedFor=${j}, polls=${y}, ${_})`)}}async function lY(){let h=rh(),f=await PY.readFile(h,"utf-8").catch(()=>"");if(!f.trim())return!1;let _=_f.load(f);if(!_||typeof _!=="object"||Array.isArray(_))return!1;return _.stopAutoTask===!0}function pY(h){if(h.whenToRun==="any")return!0;let f=new Date().getHours(),{nightStartHour:_,nightEndHour:n}=h;if(n===24)return f>=_;if(_>n)return f>=_||f<n;return f>=_&&f<n}async function eY(h,f){let _=typeof f==="string"?[f]:f;if(_.length===0)return!1;let n=Date.now()-h;for(let c of _){if(!c)continue;if(!gY(c))continue;try{let b=new kY(c,{readonly:!0});try{if((b.query("SELECT COUNT(*) as count FROM session WHERE time_updated >= ?").get(n)?.count??0)>0)return!0}finally{b.close()}}catch(b){return console.warn(`[daemon-scheduler] Failed to query session activity (treating as active): ${b instanceof Error?b.message:String(b)} db=${c}`),!0}}return!1}function x3(h){return new Promise((f)=>setTimeout(f,h))}async function T1(h,f,_){let n=y_(h.logLevel),c=B1,b=new T3(n,c);n.log("info",`Daemon listening start: whenToRun=${h.whenToRun}, window=${h.nightStartHour}:00-${h.nightEndHour}:00, sessionActiveMs=${h.sessionActiveMs}, checkIntervalMs=${h.checkIntervalMs}, minIntervalMs=${h.minIntervalMs}, maxTokensPerScheduleWindow=${h.maxTokensPerScheduleWindow}, gateHeartbeatMs=${c}, mode=${f.type}`);let y=Kn({reason:"daemon_main_loop_started"});if(y.length>0)n.log("info",`Aborted ${y.length} orphan observability attempt(s): ${y.join(", ")}`);let u=new fn,U=0,$=1800000,j=h.checkIntervalMs;while(!0)try{let{config:J}=await u.getLatest(n);if(j=J.checkIntervalMs,await lY()){n.log("info","stopAutoTask detected in config, exiting daemon main loop");break}await x3(J.checkIntervalMs);let K=pY(J),G=new Date().getHours();if(!K){b.emit("time-window","WAITING",`current=${G}:00, window=${J.nightStartHour}:00-${J.nightEndHour}:00, whenToRun=${J.whenToRun}`);continue}b.emit("time-window","PASS",`current=${G}:00 within window, whenToRun=${J.whenToRun}`);let Z=A1(),z=ah(Z),W=await eY(J.sessionActiveMs,Z),w=J.sessionActiveMs/60000;if(W){b.emit("session-activity","WAITING",`session active within ${w} minutes, ${z}`);continue}if(b.emit("session-activity","PASS",`no session active within ${w} minutes, ${z}`),wc(J)&&H1(J)){let v=Mf(J),X=nn(J);b.emit("token-budget","WAITING",`window=${v}, consumed=${X.consumed}, limit=${X.maxTokens}`);continue}if(wc(J)){let v=Mf(J),X=nn(J);b.emit("token-budget","PASS",`window=${v}, consumed=${X.consumed}, remaining=${X.maxTokens-X.consumed}`)}n.log("info","All schedule gates passed, starting evolution rounds"),await d1(J,f,_),n.log("info",`Evolution rounds complete, sleeping for ${J.minIntervalMs}ms before next iteration`),await x3(J.minIntervalMs),U=0}catch(J){let K=J instanceof Error?J.message:String(J);U++;let G=Math.min(j*Math.pow(2,U-1),$);n.log("error",`Daemon main loop error (consecutive=${U}): ${K}, backing off ${G}ms`),await x3(G)}}import rY from"path";import{promises as C3}from"fs";async function q3(h){let f=await C3.readFile(h,"utf-8").catch((n)=>{if(n&&typeof n==="object"&&"code"in n&&n.code==="ENOENT")return"";throw n});if(!f.trim())return{};let _=_f.load(f);if(_&&typeof _==="object"&&!Array.isArray(_))return _;return{}}async function x1(h,f){await C3.mkdir(rY.dirname(h),{recursive:!0}),await C3.writeFile(h,_f.dump(f,{indent:2}),"utf-8")}async function rZ(){let h=rh(),f=await q3(h);return f.stopAutoTask=!0,await x1(h,f),h}async function aZ(){let h=rh(),f=await q3(h);return f.stopAutoTask=!1,await x1(h,f),h}async function C1(){let f=(await q3(rh())).daemon;if(!f||typeof f!=="object"||Array.isArray(f))return!1;return f.autostart===!0}function V3(h){return h}function V1(h){let f=h?.trim();if(!f)return;return hc(f),f}function M3(h){if(!h.session)return h;if(typeof h.session.promptAsync!=="function")return h;let f=h.session.promptAsync.bind(h.session),_=Object.assign(Object.create(Object.getPrototypeOf(h.session)),h.session);return{...h,session:Object.assign(_,{promptAsync:async(n)=>{try{return await f(n)}catch(c){if(!n||typeof n!=="object"||!("sessionID"in n))throw c;let b=n;return f({path:{id:b.sessionID},body:{...b.agent!==void 0?{agent:b.agent}:{},...b.tools!==void 0?{tools:b.tools}:{},...b.parts!==void 0?{parts:b.parts}:{},...b.model!==void 0?{model:b.model}:{},...b.noReply!==void 0?{noReply:b.noReply}:{}}})}}})}}function aY(h){let f=h.skillName??"all",_=[l(k.SKILL_EVOLVER_AUTO_DISPATCH_STARTED,{sessionId:h.sessionId}),`skill: ${f}`,l(k.SKILL_EVOLVER_AUTO_CHECK_LOG)];if(h.sourceSessionId)_.push(`source_session: ${h.sourceSessionId}`);return _.join(`
`)}async function q1(h,f,_){if(typeof h.session?.prompt!=="function")return;await h.session.prompt({path:{id:f},body:{noReply:!0,parts:[{type:"text",text:_}]}}).catch(()=>{return})}async function iY(h){let f=h.skillName??"all",_=y_("info");try{E3(),await new Promise((c,b)=>{let y=0,u=30,U=setInterval(async()=>{if(y++,cn()){clearInterval(U),c();return}if(y>=u){clearInterval(U),b(Error("setModelRef timeout after 30s"));return}await R3(h.sessionId);let $=cn();if($)_.log("info",`[skill-evolver-auto] setModelRef success, providerID=${$.providerID}, modelID=${$.modelID}, sessionId=${h.sessionId}, attempt=${y}`);else _.log("debug",`[skill-evolver-auto] setModelRef attempt=${y}, modelInfo still null, sessionId=${h.sessionId}`)},1000)});let n=await tY({client:h.client,skillName:h.skillName});await q1(h.client,h.sessionId,`${l(k.SKILL_EVOLVER_AUTO_EXITED,{status:n.status,skill:f})}${l(k.SKILL_EVOLVER_AUTO_CHECK_LOG)}`),await h.onComplete?.(l(k.SKILL_EVOLVER_AUTO_COMPLETED,{sessionId:h.sessionId,skill:f}),"info")}catch(n){let c=n instanceof Error?n.message:String(n);await q1(h.client,h.sessionId,l(k.SKILL_EVOLVER_AUTO_FAILED,{message:c})),await h.onComplete?.(l(k.SKILL_EVOLVER_AUTO_FAILED_DETAIL,{sessionId:h.sessionId,skill:f,error:c}),"error")}}async function $9(h){if(await C1()===!1)return{ok:!1,message:l(k.SKILL_EVOLVER_AUTO_NOT_ENABLED)};let _;try{_=V1(h.arguments)}catch(b){let y=b instanceof Error?b.message:String(b);return{ok:!1,message:l(k.SKILL_EVOLVER_AUTO_FAILED,{message:y})}}let n=V3(h.client),c=h.sourceSessionId??"";return iY({client:n,sessionId:c,skillName:_,onComplete:h.onBackgroundComplete}).catch(async(b)=>{let y=b instanceof Error?b.message:String(b);await h.onBackgroundComplete?.(l(k.SKILL_EVOLVER_AUTO_BG_UNCAUGHT,{sessionId:c,skill:_??"all",error:y}),"error"),Y(`[skill-evolver-auto] background task unhandled error: sessionId=${c}, skill=${_??"all"}, error=${y}`)}),{ok:!0,sessionId:c,message:aY({sessionId:c,skillName:_,sourceSessionId:h.sourceSessionId})}}async function tY(h){let _={server:{client:M3(h.client),close:async()=>{}},skipExpectationsJsonAudit:!0,preferPrompt:!0,model:cn()??void 0},n=V1(h.skillName),c=hn(),{config:b}=await new fn().getLatest();return await T1(b,c,{runtime:_,skills:n?[n]:void 0}),{status:"exited"}}import uh from"fs";import S1 from"path";var oY=1,M1=!1;function S3(h){let f=h.trim();if(!f)throw Error("sessionId must be non-empty for task status");return f}function D1(h){return typeof h.userIntention==="string"&&typeof h.status==="string"&&!("tasksBySessionId"in h)}function D3(h){if(!uh.existsSync(h))return null;try{let f=JSON.parse(uh.readFileSync(h,"utf-8"));if(!D1(f))return null;return f}catch{return null}}function L3(h,f){let _=S1.dirname(h);if(!uh.existsSync(_))uh.mkdirSync(_,{recursive:!0});let n=`${h}.tmp`;uh.writeFileSync(n,`${JSON.stringify(f,null,2)}
`,"utf-8"),uh.renameSync(n,h)}function sY(){bn();let h=R1();if(!uh.existsSync(h))return[];return uh.readdirSync(h).filter((f)=>f.endsWith(".json")&&!f.endsWith(".tmp")).map((f)=>S1.join(h,f))}function bn(){if(M1)return;M1=!0;let h=E1();if(!uh.existsSync(h))return;try{let f=JSON.parse(uh.readFileSync(h,"utf-8")),_=[];if(f.schemaVersion===oY&&f.tasksBySessionId&&typeof f.tasksBySessionId==="object"){let c=f;for(let[b,y]of Object.entries(c.tasksBySessionId))_.push({sessionId:b,status:y})}else if(D1(f)){let c=f;_.push({sessionId:c.sessionId?.trim()||"__legacy__",status:c})}for(let c of _){let b=c.sessionId.trim()||"__legacy__",y=yn(b);if(uh.existsSync(y))continue;L3(y,{...c.status,sessionId:b==="__legacy__"?c.status.sessionId:b})}let n=`${h}.migrated`;if(uh.existsSync(n))uh.unlinkSync(n);uh.renameSync(h,n)}catch{}}function m3(h){return{sessionId:null,workerSessionId:null,skillName:null,userIntention:h,startedAt:new Date().toISOString(),currentRound:1,totalRounds:1,status:"running",steps:[],result:null,error:null,finishedAt:null}}function cf(h){bn();let f=S3(h);return D3(yn(f))}function yf(h,f){bn();let _=S3(h),n=yn(_);if(D3(n)&&f.status==="running"){f.error=null,f.finishedAt=null;for(let b of f.steps)if(b.state==="interrupted")b.state="running"}L3(n,{...f,sessionId:_})}function L1(h){bn();let f=S3(h),_=yn(f);if(uh.existsSync(_))uh.unlinkSync(_)}function Qc(h){return h==="completed"||h==="failed"||h==="interrupted"}function m1(h,f){return["\u751F\u6210\u6D4B\u8BC4\u96C6","\u521B\u5EFA\u8FDB\u5316\u5DE5\u4F5C\u7A7A\u95F4","\u751F\u6210\u6280\u80FD","\u8FD0\u884CAB\u6D4B\u8BD5","\u5206\u6790AB\u6D4B\u8BD5\u7ED3\u679C"].map((n)=>({name:n,round:h,state:"pending",summary:null,updatedAt:null}))}function vc(h,f,_,n,c){let b=h.steps.find((y)=>y.name===f&&y.round===_);if(b)b.state=n,b.summary=c??b.summary,b.updatedAt=new Date().toISOString();else h.steps.push({name:f,round:_,state:n,summary:c??null,updatedAt:new Date().toISOString()});return h}function N1(h,f){return h.status="completed",h.result=f,h.finishedAt=new Date().toISOString(),h}function Hc(h,f){return h.status="failed",h.error=f,h.finishedAt=new Date().toISOString(),h}function h5(h){if(Qc(h.status))return h;h.status="interrupted";let f=h.steps.filter((_)=>_.state==="running");for(let _ of f)_.state="interrupted",_.updatedAt=new Date().toISOString();return h.error=l(k.SKILL_EVOLVER_TASK_INTERRUPTED),h.finishedAt=new Date().toISOString(),h}function F1(){bn();let h=[];for(let f of sY()){let _=D3(f);if(!_||Qc(_.status))continue;let n=h5(_);L3(f,n),h.push(n)}return h}function f5(h){if(h==="completed")return"completed";if(h==="running")return"in_progress";if(h==="interrupted"||h==="failed")return"cancelled";return"pending"}function _5(h){return h.steps.map((f)=>{let _=f.summary?` \u2192 ${f.summary}`:"",n=`${f.name}${_}`,c=f5(f.state),y={running:"high",failed:"medium",interrupted:"medium",completed:"low",pending:"low"}[f.state];return{content:n,status:c,priority:y}})}function W9(h){let f=h.skillName??l(k.SKILL_EVOLVER_UNKNOWN_SKILL),n={completed:l(k.SKILL_EVOLVER_STATUS_COMPLETED),failed:l(k.SKILL_EVOLVER_STATUS_FAILED),interrupted:l(k.SKILL_EVOLVER_STATUS_INTERRUPTED),running:l(k.SKILL_EVOLVER_STATUS_RUNNING)}[h.status]??l(k.SKILL_EVOLVER_STATUS_RUNNING),c=_5(h),b=JSON.stringify(c,null,2);return["Output current status only:",`skillName: ${f}, status: ${n}`,"Use the todowrite tool to display the following task steps, do not perform other actions:",b].join(`
`)}function n5(h){if(typeof h.session?.promptAsync!=="function"&&typeof h.session?.prompt!=="function")return l(k.SKILL_EVOLVER_CLIENT_UNAVAILABLE);return}var c5=1;function g1(){return c5}var un=null;function cn(){return un}function E3(){un=null}function z3(h){un=h}function hf(...h){for(let f of[...h,un])if(f?.providerID&&f?.modelID)return{providerID:f.providerID,modelID:f.modelID};return}async function y5(h){let f=h.sourceSessionId.trim(),n={client:M3(h.client)};E3(),await new Promise((y,u)=>{let U=0,$=30,j=setInterval(async()=>{if(U++,un){clearInterval(j),y();return}if(U>=$){clearInterval(j),u(Error("setModelRef timeout after 30s"));return}await R3(h.workerSessionId)},1000)});let c={sessionID:h.workerSessionId,evolutionGateSessionID:f,directory:h.directory,model:cn()??void 0},b={onStageStart:async(y,u)=>{let U=cf(f);if(!U)return;U.currentRound=u,U.status="running",U=vc(U,y,u,"running"),yf(f,U)},onStageComplete:async(y,u,U)=>{let $=cf(f);if(!$)return;if($=vc($,y,u,"completed",U),y===l(k.SKILL_EVOLVER_STEP_GEN_EVAL_SET))$.skillName=U?.replace(l(k.SKILL_EVOLVER_STEP_NEEDS_ANALYSIS_PREFIX),"")??null;yf(f,$)},onPipelineComplete:async(y)=>{let u=cf(f);if(!u)return;u=N1(u,y),yf(f,u)},onPipelineError:async(y,u)=>{let U=cf(f);if(!U)return;let $=U.steps.find((j)=>j.state==="running");if($)U=vc(U,$.name,$.round,"failed",u);U=Hc(U,l(k.SKILL_EVOLVER_STEP_FAILED,{stage:y,error:u})),yf(f,U)}};try{let y=cf(f);if(!y)y=m3(h.userIntention);let u=g1();for(let U=1;U<=u;U++)y.steps=[...y.steps,...m1(U,u)];y.totalRounds=u,yf(f,y),await w3(n,{user_intention:h.userIntention},c,b)}catch(y){let u=y instanceof Ph||y instanceof Error?y.message:String(y),U=cf(f);if(U)U=Hc(U,u),yf(f,U)}finally{h_(f)}}async function R3(h){try{let f=I1.make(h),_=await k1.messages({sessionID:f});for(let n=_.length-1;n>=0;n--){let c=_[n]?.info,y=((u)=>u!=null&&typeof u==="object"&&!Array.isArray(u))(c)?c:void 0;if(y?.role==="user"&&y?.model?.providerID&&y?.model?.modelID){z3({providerID:y.model.providerID,modelID:y.model.modelID});break}}}catch(f){Y(`[setModelRef]modelId error:${f instanceof Error?f.message:String(f)}`)}}async function O9(h){let f=h.userIntention.trim();if(!f)return{ok:!1,message:l(k.SKILL_EVOLVER_INTENTION_EMPTY)};let _=h.sessionID.trim();if(!_)return{ok:!1,message:"sessionID is required to run skill-evolver in this OpenCode session"};let n=cf(_);if(n&&Qc(n.status))L1(_);let c=V3(h.client),b=n5(c);if(b)return{ok:!1,message:l(k.SKILL_EVOLVER_FAILED,{message:b})};try{k_(_)}catch(y){if(y instanceof I_)return{ok:!1,message:y.message};let u=y instanceof Error?y.message:String(y);return{ok:!1,message:l(k.SKILL_EVOLVER_FAILED,{message:u})}}try{let y=m3(f);return y.sessionId=_,y.workerSessionId=_,y.totalRounds=g1(),yf(_,y),y5({client:c,workerSessionId:_,userIntention:f,directory:h.directory,sourceSessionId:_}).catch(async(u)=>{let U=u instanceof Error?u.message:String(u),$=cf(_);if($)$=Hc($,l(k.SKILL_EVOLVER_BG_UNCAUGHT,{message:U})),yf(_,$);Y(`[skill-evolver] background task unhandled error: sessionId=${_}, error=${U}`)}),{ok:!0,result:l(k.SKILL_EVOLVER_DISPATCH_STARTED_BG)}}catch(y){h_(_);let u=y instanceof Error?y.message:String(y);return{ok:!1,message:l(k.SKILL_EVOLVER_DISPATCH_FAILED,{message:u})}}}function B9(){return F1()}
export{j5 as bi,Y5 as ci,Nh as di,F3 as ei,g5 as fi,Sf as gi,dh as hi,nJ as ii,Pc as ji,BJ as ki,Lf as li,_2 as mi,th as ni,Ih as oi,Mh as pi,ic as qi,Xh as ri,G2 as si,zh as ti,Cb as ui,NJ as vi,FJ as wi,IJ as xi,_8 as yi,w_ as zi,Eu as Ai,Su as Bi,W2 as Ci,H2 as Di,gJ as Ei,PJ as Fi,W_ as Gi,l6 as Hi,YU as Ii,Eh as Ji,R as Ki,Yh as Li,ch as Mi,Hh as Ni,rZ as Oi,aZ as Pi,V1 as Qi,$9 as Ri,cf as Si,W9 as Ti,cn as Ui,hf as Vi,R3 as Wi,O9 as Xi,B9 as Yi,bc as Zi,JW as _i};
 B:/~BUN