export function validateName(content:string):string {
    const trimmed = content.trim();
    if(!trimmed) throw new Error("Must be fill");
    if(trimmed.length>50) throw new Error("Must be less than 50 characters");
    return trimmed;
}