import React from 'react'
import Link from 'next/link'

import { useTranslation } from 'lib/../i18n'

export function PaginationUI({
  prevPath,
  nextPath,
  currentPage,
  currentPath,
  lastPath,
  firstPath,
  hrefPathname,
  prevPage,
  nextPage,
  lastPage,
  showFirst,
  showLast,
  showPrev,
  showNext,
  prevLabel,
  nextLabel,
  className
}) {
  const { t } = useTranslation()

  const nextPrevPageClasses = 'no-underline rounded-lg text-green border-2 border-green hover:bg-primary text-xxxs xs:text-xs sm:text-base lg:text-lg py-2 sm:py-2 px-3 sm:px-3 lg:px-5 trans whitespace-normal inline-flex sm:inline-block text-center h-10 sm:h-auto items-center justify-center leading-tight'
  const pageNumClasses = 'inline-flex items-center justify-center no-underline text-green bg-card trans p-2 sm:p-2 rounded-lg text-sm sm:text-base mx-1 leading-none shadow-md'
  const ellipsisClasses = 'mx-2 lg:mx-3 mt-1 hidden sm:block text-inverse'
  const listItemClasses = 'lg:mx-2 mt-1 lg:mt-2'

  return (
    <div
      className={'mt-10 flex w-full'}
    >
      <div
        className='w-1/4 text-left'
      >
        {showPrev &&
          <Link
            as={prevPath}
            href={{
              pathname: hrefPathname,
              query: {
                page: prevPage
              }
            }}
            scroll={false}
          >
            <a
              href={prevPath}
              className={nextPrevPageClasses}
            >
              {t('previousPage')}
            </a>
          </Link>
        }
      </div>
      <div
        className='w-1/2 justify-center items-center text-center flex'
      >
        <ul
          className='flex justify-center items-center mx-auto'
        >
          {showFirst &&
            <>
              <li
                className={listItemClasses}
              >
                <Link
                  as={firstPath}
                  href={{
                    pathname: hrefPathname,
                    query: {
                      page: 1
                    }
                  }}
                  scroll={false}
                >
                  <a
                    href={firstPath}
                    className={pageNumClasses}
                  >
                    1
                  </a>
                </Link>
              </li>
              <li
                className={ellipsisClasses}
              >
                ...
              </li>
            </>
          }

          {showPrev &&
            <li
              className={listItemClasses}
            >
              <Link
                as={prevPath}
                href={{
                  pathname: hrefPathname,
                  query: {
                    page: prevPage
                  }
                }}
                scroll={false}
              >
                <a
                  href={prevPath}
                  className={pageNumClasses}
                >
                  {prevPage}
                </a>
              </Link>
            </li>
          }
          <li
            id='current-page-num'
            className={listItemClasses}
          >
            <Link
              as={prevPath}
              href={{
                pathname: hrefPathname,
                query: {
                  page: currentPage
                }
              }}
              scroll={false}
            >
              <a
                className={pageNumClasses}
              >
                {nextPage - 1}
              </a>
            </Link>
          </li>
          {showNext &&
            <li
              className={listItemClasses}
            >
              <Link
                as={nextPath}
                href={{
                  pathname: hrefPathname,
                  query: {
                    page: nextPage
                  }
                }}
                scroll={false}
              >
                <a
                  href={nextPath}
                  className={pageNumClasses}
                >
                  {nextPage}
                </a>
              </Link>
            </li>
          }

          {showLast &&
            <>
              <li
                className={ellipsisClasses}
              >
                ...
              </li>
              <li
                className={listItemClasses}
              >
                <Link
                  as={lastPath}
                  href={{
                    pathname: hrefPathname,
                    query: {
                      page: lastPage
                    }
                  }}
                  scroll={false}
                >
                  <a
                    href={lastPath}
                    className={pageNumClasses}
                  >
                    {lastPage}
                  </a>
                </Link>
              </li>
            </>
          }
        </ul>
      </div>
      <div
        className='w-1/4 text-right'
      >
        {showNext &&
          <Link
            as={nextPath}
            href={{
              pathname: hrefPathname,
              query: {
                page: nextPage
              }
            }}
            scroll={false}
          >
            <a
              href={nextPath}
              className={nextPrevPageClasses}
            >
              {t('nextPage')}
            </a>
          </Link>
        }
      </div>
    </div>
  )
}