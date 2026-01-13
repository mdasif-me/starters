import Image from 'next/image';
import logo from '../../../public/logo.svg';

export default function LogoWithName() {
  return (
    <div className='flex items-center gap-3'>
      <Image src={logo} alt='Logo' width={40} height={40} />
      <article>
        <h3 className='text-lg leading-8 text-[#0F172B]'>EduCenter</h3>
        <p className='text-xs leading-4 text-[#62748E]'>Management Portal</p>
      </article>
    </div>
  );
}
