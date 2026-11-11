const cases = {
  parentheses: {
    kicker:'CASE STUDY 01 · STACK MATCHING', title:'Balanced Parentheses Validator',
    description:'Checks whether every opening parenthesis has a matching closing parenthesis in the correct order.',
    hint:'Alphabet: { (, ) }', value:'(()())', examples:['(()())','((())','())','()()'],
    grammar:'S → (S)S\nS → ε',
    pda:'Push a marker for each opening parenthesis. Pop one marker for each closing parenthesis. Accept when the input ends and only the bottom marker remains.',
    language:'L = { w ∈ {(,)}* | w is balanced }',
    notes:['Uses an unbounded stack.','Order of closing symbols matters.','Empty string is accepted.']
  },
  arithmetic: {
    kicker:'CASE STUDY 02 · RECURSIVE SYNTAX', title:'Arithmetic Expression Validator',
    description:'Validates expressions with identifiers or numbers, parentheses, and the operators +, −, ×, and ÷. It checks syntax, not the computed result.',
    hint:'Alphabet: numbers, identifiers, + − * / ( )', value:'(a + 12) * b / 3', examples:['a + 12 * b','(x + 2) * 5','a + * b','(a + b'],
    grammar:'E → T E′\nE′ → + T E′ | - T E′ | ε\nT → F T′\nT′ → * F T′ | / F T′ | ε\nF → (E) | id | num',
    pda:'A parser uses a stack (or recursive procedure stack) to process nested expressions. E handles addition/subtraction; T handles multiplication/division; F handles atoms and parenthesized expressions.',
    language:'L = syntactically valid arithmetic expressions',
    notes:['Multiplication/division have higher precedence.','Parentheses can nest recursively.','No type checking or numeric evaluation.']
  },
  palindrome: {
    kicker:'CASE STUDY 03 · NONDETERMINISTIC MATCHING', title:'Palindrome Checker',
    description:'Checks whether a string over {a, b} reads the same forward and backward. Both even- and odd-length palindromes are supported.',
    hint:'Alphabet: { a, b }', value:'abba', examples:['abba','aba','aab','babab'],
    grammar:'S → aSa | bSb\nS → a | b | ε',
    pda:'An NPDA pushes the first half of the input, nondeterministically guesses the midpoint (consuming ε), then pops and matches the remaining symbols. It accepts if the stack empties exactly with the input.',
    language:'L = { w ∈ {a,b}* | w = wᴿ }',
    notes:['Accepts even and odd lengths.','Midpoint is guessed nondeterministically.','Empty string is a palindrome.']
  }
};
let currentCase='parentheses';
const $=id=>document.getElementById(id);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function setCase(name){currentCase=name;const c=cases[name];$('case-kicker').textContent=c.kicker;$('case-title').textContent=c.title;$('case-description').textContent=c.description;$('input-hint').textContent=c.hint;$('user-input').value=c.value;$('grammar').textContent=c.grammar;$('pda-description').textContent=c.pda;$('language').textContent=c.language;$('model-notes').innerHTML=c.notes.map(n=>`<li>${escapeHtml(n)}</li>`).join('');$('result').className='result';$('result').innerHTML='<span class="result-icon">✓</span><div><strong>Ready to validate</strong><small>Run the automaton to see the result.</small></div>';$('trace-body').innerHTML='<tr><td colspan="4" class="empty-trace">Your execution trace will appear here.</td></tr>';$('trace-count').textContent='WAITING FOR INPUT';document.querySelectorAll('.examples button').forEach((b,i)=>b.textContent=c.examples[i]||'');document.querySelectorAll('.examples button').forEach((b,i)=>b.hidden=!c.examples[i]);document.querySelectorAll('.tab').forEach(b=>{const active=b.dataset.case===name;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});}
function renderTrace(rows,accepted,message){$('trace-body').innerHTML=rows.map((r,i)=>`<tr class="${i===rows.length-1?'current':''}"><td>${r.step}</td><td>${escapeHtml(r.read)}</td><td>${escapeHtml(r.action)}</td><td class="${r.ok?'status-good':'status-bad'}">${escapeHtml(r.status)}</td></tr>`).join('');$('trace-count').textContent=`${rows.length} STEP${rows.length===1?'':'S'} · ${accepted?'ACCEPT':'REJECT'}`;$('result').className=`result ${accepted?'accept':'reject'}`;$('result').innerHTML=`<span class="result-icon">${accepted?'✓':'×'}</span><div><strong>${accepted?'STRING ACCEPTED':'STRING REJECTED'}</strong><small>${escapeHtml(message)}</small></div>`;}
function runParentheses(s){let stack=['Z₀'],rows=[{step:0,read:'START',action:'Initialize bottom marker Z₀',status:'INITIAL',ok:true}],ok=true,reason='';for(let i=0;i<s.length;i++){const ch=s[i];if(ch==='('){stack.push('(');rows.push({step:i+1,read:ch,action:'Push ( onto stack',status:'PUSH',ok:true});}else if(ch===')'){if(stack.length===1){rows.push({step:i+1,read:ch,action:'No opening ( to pop',status:'UNDERFLOW',ok:false});ok=false;reason=`Unexpected ')' at position ${i+1}; no matching opening parenthesis.`;break;}stack.pop();rows.push({step:i+1,read:ch,action:'Pop matching ( from stack',status:'POP',ok:true});}else{rows.push({step:i+1,read:ch,action:'Symbol is outside the alphabet {(,)}',status:'INVALID SYMBOL',ok:false});ok=false;reason=`Invalid symbol '${ch}' at position ${i+1}.`;break;}}
if(ok&&stack.length>1){ok=false;reason=`Input ended with ${stack.length-1} unmatched opening parenthesis(es).`;rows.push({step:s.length+1,read:'END',action:`${stack.length-1} opening marker(s) remain`,status:'NOT EMPTY',ok:false});}else if(ok){rows.push({step:s.length+1,read:'END',action:'Only bottom marker Z₀ remains',status:'ACCEPT',ok:true});reason='All opening parentheses were matched in the correct order.';}renderTrace(rows,ok,reason);}
function tokenize(s){const tokens=[];let i=0;while(i<s.length){if(/\s/.test(s[i])){i++;continue;}const rest=s.slice(i);const m=rest.match(/^(?:\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_]*)/);if(m){tokens.push({type:/^\d/.test(m[0])?'num':'id',value:m[0],pos:i});i+=m[0].length;continue;}if('+-*/()'.includes(s[i])){tokens.push({type:s[i],value:s[i],pos:i});i++;continue;}throw new Error(`Invalid character '${s[i]}' at position ${i+1}.`);}return tokens;}
function parseArithmetic(s){let t=tokenize(s),i=0,steps=[];const peek=()=>t[i]?.type||'EOF';const take=()=>t[i++];function eat(type){if(peek()===type)return take();throw new Error(`Expected '${type}' but found '${t[i]?.value??'end of input'}'${t[i]?` at position ${t[i].pos+1}`:''}.`);}function E(){steps.push('E → T E′');T();while(peek()==='+'||peek()==='-'){let op=take().value;steps.push(`E′ → ${op} T E′`);T();}steps.push('E′ → ε');}function T(){steps.push('T → F T′');F();while(peek()==='*'||peek()==='/'){let op=take().value;steps.push(`T′ → ${op} F T′`);F();}steps.push('T′ → ε');}function F(){if(peek()==='('){steps.push('F → (E)');eat('(');E();eat(')');}else if(peek()==='id'){let v=take().value;steps.push(`F → id (${v})`);}else if(peek()==='num'){let v=take().value;steps.push(`F → num (${v})`);}else{throw new Error(`Expected an identifier, number, or '(' but found '${t[i]?.value??'end of input'}'${t[i]?` at position ${t[i].pos+1}`:''}.`);}}if(!t.length)throw new Error('Expression is empty.');E();if(peek()!=='EOF')throw new Error(`Unexpected token '${t[i].value}' at position ${t[i].pos+1}.`);return steps;}
function runArithmetic(s){try{const steps=parseArithmetic(s);const rows=[{step:0,read:'START',action:'Begin with start symbol E',status:'INITIAL',ok:true},...steps.map((x,i)=>({step:i+1,read:'—',action:x,status:'PRODUCTION',ok:true})),{step:steps.length+1,read:'END',action:'All tokens consumed; parse completed',status:'ACCEPT',ok:true}];renderTrace(rows,true,'The expression follows the grammar and all input tokens were consumed.');}catch(e){renderTrace([{step:0,read:'START',action:'Begin parsing from E',status:'INITIAL',ok:true},{step:1,read:'ERROR',action:e.message,status:'REJECT',ok:false}],false,e.message);}}
function runPalindrome(s){
  const invalid=[...s].findIndex(c=>c!=='a'&&c!=='b');
  if(invalid!==-1){renderTrace([{step:0,read:'START',action:'Initialize NPDA',status:'INITIAL',ok:true},{step:1,read:s[invalid],action:`Symbol outside alphabet {a,b} at position ${invalid+1}`,status:'INVALID SYMBOL',ok:false}],false,`Invalid symbol '${s[invalid]}' at position ${invalid+1}.`);return;}
  let choice=null;
  // Even-length branch: split into two equal halves.
  for(let k=0;k<=s.length;k++) if(s.slice(0,k)===s.slice(k).split('').reverse().join('')) { choice={left:s.slice(0,k),rightStart:k,mid:null,split:k}; break; }
  // Odd-length branch: nondeterministically consume one central symbol.
  if(!choice) for(let k=0;k<s.length;k++) if(s.slice(0,k)===s.slice(k+1).split('').reverse().join('')) { choice={left:s.slice(0,k),rightStart:k+1,mid:s[k],split:k}; break; }
  const rows=[{step:0,read:'START',action:'Initialize stack; NPDA guesses a midpoint',status:'INITIAL',ok:true}];
  const left=choice?choice.left:s.slice(0,Math.floor(s.length/2));
  let stack=[];
  for(let i=0;i<left.length;i++){stack.push(s[i]);rows.push({step:rows.length,read:s[i],action:`Before midpoint: push ${s[i]}`,status:'PUSH',ok:true});}
  let next=left.length;
  if(choice&&choice.mid!==null){rows.push({step:rows.length,read:choice.mid,action:'Consume the single middle symbol using the odd-length branch',status:'MIDPOINT',ok:true});next=choice.rightStart;}
  else if(choice){rows.push({step:rows.length,read:'ε',action:'Guess midpoint using an ε-transition',status:'MIDPOINT',ok:true});next=choice.rightStart;}
  else {rows.push({step:rows.length,read:'ε',action:'Try a midpoint; no choice can complete all matches',status:'GUESS',ok:true});next=Math.floor(s.length/2);}
  let mismatch=false;
  for(let i=next;i<s.length;i++){const top=stack.pop();const good=top===s[i];rows.push({step:rows.length,read:s[i],action:`Pop ${top??'∅'} and compare with ${s[i]}`,status:good?'MATCH':'MISMATCH',ok:good});if(!good){mismatch=true;break;}}
  const accepted=!!choice&&!mismatch&&stack.length===0;
  rows.push({step:rows.length,read:'END',action:accepted?'Input consumed and stack is empty':'No midpoint choice leads to a complete match',status:accepted?'ACCEPT':'REJECT',ok:accepted});
  renderTrace(rows,accepted,accepted?`Palindrome accepted using ${choice.mid===null?'an even-length':'an odd-length'} midpoint choice.`:'The string is not a palindrome; no NPDA midpoint choice succeeds.');
}
function run(){const s=$('user-input').value;if(currentCase==='parentheses')runParentheses(s);else if(currentCase==='arithmetic')runArithmetic(s);else runPalindrome(s);}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>setCase(b.dataset.case)));document.querySelectorAll('.examples button').forEach(b=>b.addEventListener('click',()=>{$('user-input').value=b.dataset.example;run();}));$('run-button').addEventListener('click',run);$('user-input').addEventListener('keydown',e=>{if(e.key==='Enter')run();});setCase('parentheses');run();
