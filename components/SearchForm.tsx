import React from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { Input } from './ui/input'

const SearchForm = () => {
  return (
    <div className="flex-1 md:max-w-2xl md:mx-4">
            <form action="/" method="GET" className="relative">
              <div className="relative">
                <Input
                  type="text"
                  name="q"
                  placeholder="Jobs by title or description..."
                  className="bg-black border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus:bg-black hover:bg-black"
                  style={{
                    colorScheme: 'dark'
                  }}
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 hidden sm:flex"
                >
                  Search
                </Button>
                {/* Mobile search icon */}
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 sm:hidden p-2"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
  )
}

export default SearchForm