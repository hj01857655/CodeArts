// @bun
import{bx as a,cx as l,fx as f,gx as t,lx as n,ux as g}from"B:/~BUN/root/chunk-h1qksfk4.js";import{Ax as u}from"B:/~BUN/root/chunk-jt3sxy22.js";import{Dx as e}from"B:/~BUN/root/chunk-3jhkx5f3.js";import{lz as h}from"B:/~BUN/root/chunk-asxdrssd.js";import{$A as b,Hz as i,rC as s,uB as c}from"B:/~BUN/root/chunk-sb5g03zb.js";import{DC as v}from"B:/~BUN/root/chunk-ev18efmf.js";import*as R from"path";import*as N from"fs/promises";import*as T from"path";import*as _ from"fs/promises";import{readFileSync as YY}from"fs";var w;((L)=>{let A=s.create({service:"patch"});L.PatchSchema=v.object({patchText:v.string().describe("The full patch text that describes all changes to be made")});let C;((Y)=>{Y.ParseError="ParseError";Y.IoError="IoError";Y.ComputeReplacements="ComputeReplacements";Y.ImplicitInvocation="ImplicitInvocation"})(C=L.ApplyPatchError||={});let j;((Y)=>{Y.Body="Body";Y.ShellParseError="ShellParseError";Y.PatchParseError="PatchParseError";Y.NotApplyPatch="NotApplyPatch"})(j=L.MaybeApplyPatch||={});let D;((Y)=>{Y.Body="Body";Y.ShellParseError="ShellParseError";Y.CorrectnessError="CorrectnessError";Y.NotApplyPatch="NotApplyPatch"})(D=L.MaybeApplyPatchVerified||={});function k(B,$){let W=B[$];if(W.startsWith("*** Add File:")){let J=W.slice(13).trim();return J?{filePath:J,nextIdx:$+1}:null}if(W.startsWith("*** Delete File:")){let J=W.slice(16).trim();return J?{filePath:J,nextIdx:$+1}:null}if(W.startsWith("*** Update File:")){let J=W.slice(16).trim(),Y,Q=$+1;if(Q<B.length&&B[Q].startsWith("*** Move to:"))Y=B[Q].slice(12).trim(),Q++;return J?{filePath:J,movePath:Y,nextIdx:Q}:null}return null}function P(B,$){let W=[],J=$;while(J<B.length&&!B[J].startsWith("***"))if(B[J].startsWith("@@")){let Y=B[J].substring(2).trim();J++;let Q=[],Z=[],H=!1;while(J<B.length&&!B[J].startsWith("@@")&&!B[J].startsWith("***")){let q=B[J];if(q==="*** End of File"){H=!0,J++;break}if(q.startsWith(" ")){let G=q.substring(1);Q.push(G),Z.push(G)}else if(q.startsWith("-"))Q.push(q.substring(1));else if(q.startsWith("+"))Z.push(q.substring(1));J++}W.push({old_lines:Q,new_lines:Z,change_context:Y||void 0,is_end_of_file:H||void 0})}else J++;return{chunks:W,nextIdx:J}}function M(B,$){let W="",J=$;while(J<B.length&&!B[J].startsWith("***")){if(B[J].startsWith("+"))W+=B[J].substring(1)+`
`;J++}if(W.endsWith(`
`))W=W.slice(0,-1);return{content:W,nextIdx:J}}function p(B){let $=B.match(/^(?:cat\s+)?<<['"]?(\w+)['"]?\s*\n([\s\S]*?)\n\1\s*$/);if($)return $[2];return B}function m(B){let W=p(B.trim()).split(`
`),J=[],Y=0,Q="*** Begin Patch",Z="*** End Patch",H=W.findIndex((G)=>G.trim()===Q),q=W.findIndex((G)=>G.trim()===Z);if(H===-1||q===-1||H>=q)throw Error("Invalid patch format: missing Begin/End markers");Y=H+1;while(Y<q){let G=k(W,Y);if(!G){Y++;continue}if(W[Y].startsWith("*** Add File:")){let{content:F,nextIdx:d}=M(W,G.nextIdx);J.push({type:"add",path:G.filePath,contents:F}),Y=d}else if(W[Y].startsWith("*** Delete File:"))J.push({type:"delete",path:G.filePath}),Y=G.nextIdx;else if(W[Y].startsWith("*** Update File:")){let{chunks:F,nextIdx:d}=P(W,G.nextIdx);J.push({type:"update",path:G.filePath,move_path:G.movePath,chunks:F}),Y=d}else Y++}return{hunks:J}}L.parsePatch=m;function I(B){let $=["apply_patch","applypatch"];if(B.length===2&&$.includes(B[0]))try{let{hunks:W}=m(B[1]);return{type:"Body",args:{patch:B[1],hunks:W}}}catch(W){return{type:"PatchParseError",error:W}}if(B.length===3&&B[0]==="bash"&&B[1]==="-lc"){let J=B[2].match(/apply_patch\s*<<['"](\w+)['"]\s*\n([\s\S]*?)\n\1/);if(J){let Y=J[2];try{let{hunks:Q}=m(Y);return{type:"Body",args:{patch:Y,hunks:Q}}}catch(Q){return{type:"PatchParseError",error:Q}}}}return{type:"NotApplyPatch"}}L.maybeParseApplyPatch=I;function y(B,$){let W;try{W=YY(B,"utf-8")}catch(q){throw Error(`Failed to read file ${B}: ${q}`)}let J=W.split(`
`);if(J.length>0&&J[J.length-1]==="")J.pop();let Y=K(J,B,$),Q=U(J,Y);if(Q.length===0||Q[Q.length-1]!=="")Q.push("");let Z=Q.join(`
`);return{unified_diff:O(W,Z),content:Z}}L.deriveNewContentsFromChunks=y;function K(B,$,W){let J=[],Y=0;for(let Q of W){if(Q.change_context){let G=X(B,[Q.change_context],Y);if(G===-1)throw Error(`Failed to find context '${Q.change_context}' in ${$}`);Y=G+1}if(Q.old_lines.length===0){let G=B.length>0&&B[B.length-1]===""?B.length-1:B.length;J.push([G,0,Q.new_lines]);continue}let{old_lines:Z,new_lines:H}=Q,q=X(B,Z,Y,Q.is_end_of_file);if(q===-1&&Z.length>0&&Z[Z.length-1]===""){if(Z=Z.slice(0,-1),H.length>0&&H[H.length-1]==="")H=H.slice(0,-1);q=X(B,Z,Y,Q.is_end_of_file)}if(q!==-1)J.push([q,Z.length,H]),Y=q+Z.length;else throw Error(`Failed to find expected lines in ${$}:
${Q.old_lines.join(`
`)}`)}return J.sort((Q,Z)=>Q[0]-Z[0]),J}function U(B,$){let W=[...B];for(let J=$.length-1;J>=0;J--){let[Y,Q,Z]=$[J];W.splice(Y,Q);for(let H=0;H<Z.length;H++)W.splice(Y+H,0,Z[H])}return W}function z(B){return B.replace(/[\u2018\u2019\u201A\u201B]/g,"'").replace(/[\u201C\u201D\u201E\u201F]/g,'"').replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g,"-").replace(/\u2026/g,"...").replace(/\u00A0/g," ")}function V(B,$,W,J,Y){if(Y){let Q=B.length-$.length;if(Q>=W){let Z=!0;for(let H=0;H<$.length;H++)if(!J(B[Q+H],$[H])){Z=!1;break}if(Z)return Q}}for(let Q=W;Q<=B.length-$.length;Q++){let Z=!0;for(let H=0;H<$.length;H++)if(!J(B[Q+H],$[H])){Z=!1;break}if(Z)return Q}return-1}function X(B,$,W,J=!1){if($.length===0)return-1;let Y=V(B,$,W,(q,G)=>q===G,J);if(Y!==-1)return Y;let Q=V(B,$,W,(q,G)=>q.trimEnd()===G.trimEnd(),J);if(Q!==-1)return Q;let Z=V(B,$,W,(q,G)=>q.trim()===G.trim(),J);if(Z!==-1)return Z;return V(B,$,W,(q,G)=>z(q.trim())===z(G.trim()),J)}function O(B,$){let W=B.split(`
`),J=$.split(`
`),Y=`@@ -1 +1 @@
`,Q=Math.max(W.length,J.length),Z=!1;for(let H=0;H<Q;H++){let q=W[H]||"",G=J[H]||"";if(q!==G){if(q)Y+=`-${q}
`;if(G)Y+=`+${G}
`;Z=!0}else if(q)Y+=` ${q}
`}return Z?Y:""}async function E(B){if(B.length===0)throw Error("No files were modified.");let $=[],W=[],J=[];for(let Y of B)switch(Y.type){case"add":let Q=T.dirname(Y.path);if(Q!=="."&&Q!=="/")await _.mkdir(Q,{recursive:!0});await _.writeFile(Y.path,Y.contents,"utf-8"),$.push(Y.path),A.info(`Added file: ${Y.path}`);break;case"delete":await _.unlink(Y.path),J.push(Y.path),A.info(`Deleted file: ${Y.path}`);break;case"update":let Z=y(Y.path,Y.chunks);if(Y.move_path){let H=T.dirname(Y.move_path);if(H!=="."&&H!=="/")await _.mkdir(H,{recursive:!0});await _.writeFile(Y.move_path,Z.content,"utf-8"),await _.unlink(Y.path),W.push(Y.move_path),A.info(`Moved file: ${Y.path} -> ${Y.move_path}`)}else await _.writeFile(Y.path,Z.content,"utf-8"),W.push(Y.path),A.info(`Updated file: ${Y.path}`);break}return{added:$,modified:W,deleted:J}}L.applyHunksToFiles=E;async function S(B){let{hunks:$}=m(B);return E($)}L.applyPatch=S;async function o(B,$){if(B.length===1)try{return m(B[0]),{type:"CorrectnessError",error:Error("ImplicitInvocation")}}catch{}let W=I(B);switch(W.type){case"Body":let{args:J}=W,Y=J.workdir?T.resolve($,J.workdir):$,Q=new Map;for(let Z of J.hunks){let H=T.resolve(Y,Z.type==="update"&&Z.move_path?Z.move_path:Z.path);switch(Z.type){case"add":Q.set(H,{type:"add",content:Z.contents});break;case"delete":let q=T.resolve(Y,Z.path);try{let F=await _.readFile(q,"utf-8");Q.set(H,{type:"delete",content:F})}catch(F){return{type:"CorrectnessError",error:Error(`Failed to read file for deletion: ${q}`)}}break;case"update":let G=T.resolve(Y,Z.path);try{let F=y(G,Z.chunks);Q.set(H,{type:"update",unified_diff:F.unified_diff,move_path:Z.move_path?T.resolve(Y,Z.move_path):void 0,new_content:F.content})}catch(F){return{type:"CorrectnessError",error:F}}break}}return{type:"Body",action:{changes:Q,patch:J.patch,cwd:Y}};case"PatchParseError":return{type:"CorrectnessError",error:W.error};case"NotApplyPatch":return{type:"NotApplyPatch"}}}L.maybeParseApplyPatchVerified=o})(w||={});var r=`Use the \`apply_patch\` tool to edit files. Your patch language is a stripped\u2011down, file\u2011oriented diff format designed to be easy to parse and safe to apply. You can think of it as a high\u2011level envelope:

*** Begin Patch
[ one or more file sections ]
*** End Patch

Within that envelope, you get a sequence of file operations.
You MUST include a header to specify the action you are taking.
Each operation starts with one of three headers:

*** Add File: <path> - create a new file. Every following line is a + line (the initial contents).
*** Delete File: <path> - remove an existing file. Nothing follows.
*** Update File: <path> - patch an existing file in place (optionally with a rename).

Example patch:

\`\`\`
*** Begin Patch
*** Add File: hello.txt
+Hello world
*** Update File: src/app.py
*** Move to: src/main.py
@@ def greet():
-print("Hi")
+print("Hello, world!")
*** Delete File: obsolete.txt
*** End Patch
\`\`\`

It is important to remember:

- You must include a header with your intended action (Add/Delete/Update)
- You must prefix new lines with \`+\` even when creating a new file
`;var JY=v.object({patchText:v.string().describe("The full patch text that describes all changes to be made")}),TY=e.define("apply_patch",{description:r,parameters:JY,async execute(A,x){if(!A.patchText)throw Error("patchText is required");let C;try{C=w.parsePatch(A.patchText).hunks}catch(K){throw Error(`apply_patch verification failed: ${K}`)}if(C.length===0){if(A.patchText.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim()===`*** Begin Patch
*** End Patch`)throw Error("patch rejected: empty patch");throw Error("apply_patch verification failed: no hunks found")}let j=[],D="";for(let K of C){let U=R.resolve(b.directory,K.path);switch(await h(x,U),K.type){case"add":{let V=K.contents.length===0||K.contents.endsWith(`
`)?K.contents:`${K.contents}
`,X=g(f(U,U,"",V)),O=0,E=0;for(let S of l("",V)){if(S.added)O+=S.count||0;if(S.removed)E+=S.count||0}j.push({filePath:U,oldContent:"",newContent:V,type:"add",diff:X,additions:O,deletions:E}),D+=X+`
`;break}case"update":{let z=await N.stat(U).catch(()=>null);if(!z||z.isDirectory())throw Error(`apply_patch verification failed: Failed to read file to update: ${U}`);let V=await N.readFile(U,"utf-8"),X=V;try{X=w.deriveNewContentsFromChunks(U,K.chunks).content}catch(B){throw Error(`apply_patch verification failed: ${B}`)}let O=g(f(U,U,V,X)),E=0,S=0;for(let B of l(V,X)){if(B.added)E+=B.count||0;if(B.removed)S+=B.count||0}let o=K.move_path?R.resolve(b.directory,K.move_path):void 0;await h(x,o),j.push({filePath:U,oldContent:V,newContent:X,type:K.move_path?"move":"update",movePath:o,diff:O,additions:E,deletions:S}),D+=O+`
`;break}case"delete":{let z=await N.readFile(U,"utf-8").catch((O)=>{throw Error(`apply_patch verification failed: ${O}`)}),V=g(f(U,U,z,"")),X=z.split(`
`).length;j.push({filePath:U,oldContent:z,newContent:"",type:"delete",diff:V,additions:0,deletions:X}),D+=V+`
`;break}}}let k=j.map((K)=>({filePath:K.filePath,relativePath:R.relative(b.worktree,K.movePath??K.filePath).replaceAll("\\","/"),type:K.type,diff:K.diff,before:K.oldContent,after:K.newContent,additions:K.additions,deletions:K.deletions,movePath:K.movePath})),P=j.map((K)=>R.relative(b.worktree,K.filePath).replaceAll("\\","/"));await x.ask({permission:"edit",patterns:P,always:["*"],metadata:{filepath:P.join(", "),diff:D,files:k}});let M=[];for(let K of j){let U=K.type==="delete"?void 0:K.movePath??K.filePath;switch(K.type){case"add":await N.mkdir(R.dirname(K.filePath),{recursive:!0}),await N.writeFile(K.filePath,K.newContent,"utf-8"),M.push({file:K.filePath,event:"add"});break;case"update":await N.writeFile(K.filePath,K.newContent,"utf-8"),M.push({file:K.filePath,event:"change"});break;case"move":if(K.movePath)await N.mkdir(R.dirname(K.movePath),{recursive:!0}),await N.writeFile(K.movePath,K.newContent,"utf-8"),await N.unlink(K.filePath),M.push({file:K.filePath,event:"unlink"}),M.push({file:K.movePath,event:"add"});break;case"delete":await N.unlink(K.filePath),M.push({file:K.filePath,event:"unlink"});break}if(U)await a.file(U),c.publish(t.Event.Edited,{file:U})}for(let K of M)await c.publish(n.Event.Updated,K);for(let K of j){if(K.type==="delete")continue;let U=K.movePath??K.filePath;await u.touchFile(U,!0)}let p=await u.diagnostics(),I=`Success. Updated the following files:
${j.map((K)=>{if(K.type==="add")return`A ${R.relative(b.worktree,K.filePath).replaceAll("\\","/")}`;if(K.type==="delete")return`D ${R.relative(b.worktree,K.filePath).replaceAll("\\","/")}`;let U=K.movePath??K.filePath;return`M ${R.relative(b.worktree,U).replaceAll("\\","/")}`}).join(`
`)}`,y=20;for(let K of j){if(K.type==="delete")continue;let U=K.movePath??K.filePath,z=i.normalizePath(U),X=(p[z]??[]).filter((O)=>O.severity===1);if(X.length>0){let O=X.slice(0,y),E=X.length>y?`
... and ${X.length-y} more`:"";I+=`

LSP errors detected in ${R.relative(b.worktree,U).replaceAll("\\","/")}, please fix:
<diagnostics file="${U}">
${O.map(u.Diagnostic.pretty).join(`
`)}${E}
</diagnostics>`}}return{title:I,metadata:{diff:D,files:k,diagnostics:p},output:I}}});
export{w as Pw,TY as Qw};
 B:/~BUN