import useStore from './Store.jsx'

const [store] = useStore()

function Loading() {
  return <>
    {
      store.gettingUser &&
      <section data-name="user loading">
        <div className="flex text-sm justify-center items-center">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-loader-2 animate-spin" width="24"
                 height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 3a9 9 0 1 0 9 9"/>
            </svg>
          </div>
        </div>
      </section>
    }
  </>
}

export default Loading
