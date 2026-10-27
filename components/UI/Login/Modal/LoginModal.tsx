import LoginView from "./Views/LoginView";

export default function LoginModal() {
  return (
   <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      {/* Modal Wrapper */}
      <div className="relative w-full max-w-100 rounded-cozy bg-card">
        {/* View Wrapper */}
        <div className='px-6 py-6'>
          <LoginView />
        </div>
      </div>
    </div>
  );
}
