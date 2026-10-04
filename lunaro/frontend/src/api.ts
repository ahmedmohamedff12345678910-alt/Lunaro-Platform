const API=import.meta.env.VITE_API_URL||"http://localhost:4000/api";
export async function api<T>(path:string,options:RequestInit={}){const response=await fetch(`${API}${path}`,{...options,credentials:"include",headers:{"Content-Type":"application/json",...(options.headers||{})}});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.message||"Request failed");return data as T;}
export type Service={id:string;titleAr:string;titleEn:string;descriptionAr:string;descriptionEn:string;icon:string;featured:boolean;active:boolean;sortOrder:number};
export type Project={id:string;titleAr:string;titleEn:string;descriptionAr:string;descriptionEn:string;imageUrl:string|null;projectUrl:string|null;technologies:string[];featured:boolean;active:boolean;sortOrder:number};
