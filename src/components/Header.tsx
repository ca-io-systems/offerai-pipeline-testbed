import Container from './Container'
import Logo from './Logo'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EBEBEB] bg-white">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <div className="hidden md:block">
            <Logo />
          </div>

          <div className="flex-1 md:flex-none md:mx-auto">
            <SearchBar />
          </div>

          <div className="hidden md:block">
            <UserMenu />
          </div>
        </div>
      </Container>
    </header>
  )
}
