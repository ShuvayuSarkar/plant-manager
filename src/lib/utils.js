import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { Salsa } from "next/font/google"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getCookie(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trimStart();

    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

export function removeCookie(cookieName) {
  const basePath = '/';
  const currentPath = window.location.pathname;

  [basePath, currentPath].forEach(path => {
    document.cookie = `${cookieName}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax;`;
  });
}


export const salsaFont = Salsa({
  weight: '400',
  subsets: ['latin'],
})


export function formatNumber(num) {
  if (num === null || num === undefined) return '-';

  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
  }
  if (absNum >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (absNum >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return num.toString();
}
