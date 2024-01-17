<template>
  <div data-name="comments" id="comments" v-show="githubIssueId" class="mb-4">
    <div class="my-8 h-[1px]">

    </div>
    <section data-name="user loading" v-show="gettingUser">
      <div class="flex text-sm justify-center items-center">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader-2 animate-spin" width="24"
               height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3a9 9 0 1 0 9 9"/>
          </svg>
        </div>
      </div>
    </section>
    <section data-name="login" v-show="!gettingUser">
      <div class="text-center relative h-[32px]" v-show="!gettingUser">
        <div
          @mouseenter="mouseIsInsideWindow = true"
          @mouseleave="mouseIsInsideWindow = false"
          class="border-neutral-100 dark:border-neutral-700 border absolute w-[200px] px-2 py-2 rounded-[1rem] dark:bg-neutral-800 bg-white shadow left-1/2 bottom-[37px]"
          style="transform: translateX(-50%); animation: slideUp_offset .15s ease"
          v-if="userActionWindow">
          <button
            class="text-xs px-2 py-2 text-center dark:hover:bg-white/10 hover:bg-black/10 w-full rounded-[.5rem] flex items-center justify-center"
            @click="goToUser">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-github w-4 h-4 mr-2"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path
                d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/>
            </svg>
            我的 GitHub 主页
          </button>
          <button
            class="text-xs px-2 py-2 text-center dark:hover:bg-white/10 hover:bg-black/10 w-full rounded-[.5rem] flex items-center justify-center"
            @click="logout">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-logout w-4 h-4 mr-2"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/>
              <path d="M9 12h12l-3 -3"/>
              <path d="M18 15l3 -3"/>
            </svg>
            退出登录
          </button>
        </div>
        <div
          @mouseenter="mouseIsInsideWindow = true"
          @mouseleave="mouseIsInsideWindow = false"
          class="user-window dark:bg-neutral-800 bg-neutral-100 h-[32px] items-center inline-block border-none relative z-10 rounded-full hover:shadow-xl transition-all">
          <button v-show="isUserLoggedIn"
                  class="flex h-[32px] items-center border-none cursor-pointer select-none rounded-full"
                  @click.stop="userActionWindow = !userActionWindow" @focus="mouseIsInsideWindow = true"
                  @blur="mouseIsInsideWindow = false">
            <span class="w-[32px] h-[32px] overflow-hidden rounded-full">
              <img :src="user.avatar_url" alt="user avatar" class="w-full h-full">
            </span>
            <span class="text-sm pl-2 pr-2">
              {{ user.login }}
            </span>
            <span class="pr-2">
              <svg v-show="!userActionWindow" xmlns="http://www.w3.org/2000/svg"
                   class="icon icon-tabler icon-tabler-selector w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
                   stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none"
                                                                                                          d="M0 0h24v24H0z"
                                                                                                          fill="none"/><path
                d="M8 9l4 -4l4 4"/><path d="M16 15l-4 4l-4 -4"/></svg>
              <svg v-show="userActionWindow" xmlns="http://www.w3.org/2000/svg"
                   class="icon icon-tabler icon-tabler-x w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
                   stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none"
                                                                                                          d="M0 0h24v24H0z"
                                                                                                          fill="none"/><path
                d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>
            </span>
          </button>
          <button @click="login" v-show="!isUserLoggedIn"
                  class="text-sm px-8 py-2 rounded-full dark:bg-white dark:text-black flex items-center mx-auto bg-neutral-800 text-white shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" viewBox="0 0 24 24" stroke-width="2"
                 stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path
                d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/>
            </svg>
            登录以发表评论
          </button>
        </div>
      </div>
    </section>
    <section data-name="textarea" class="pt-8" v-show="isUserLoggedIn">
      <form action="javascript:" @submit="sendComment">
        <div class="flex mb-2">
          <button type="button" @click="showPreview = false"
                  class="rounded-full text-sm px-4 py-2 flex items-center group transition-all"
                  :class="{
            'dark:bg-white dark:text-black bg-neutral-800 text-white': !showPreview,
            'dark:bg-white/10 dark:text-white bg-black/5 text-black': showPreview
          }">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="icon icon-tabler icon-tabler-markdown w-5 h-5 mr-1 top-0 group-hover:top-[-.2rem] relative transition-all"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"/>
              <path d="M7 15v-6l2 2l2 -2v6"/>
              <path d="M14 13l2 2l2 -2m-2 2v-6"/>
            </svg>
            书写
          </button>
          <button type="button" @click="showPreview = true"
                  class="rounded-full text-sm px-4 py-2 ml-2 flex items-center group" :class="{
          'dark:bg-white dark:text-black bg-neutral-800 text-white': showPreview,
          'dark:bg-white/10 dark:text-white bg-black/5 text-black': !showPreview
          }">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="icon icon-tabler icon-tabler-eye-code w-5 h-5 mr-1 top-0 group-hover:top-[-.2rem] relative transition-all"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>
              <path
                d="M11.11 17.958c-3.209 -.307 -5.91 -2.293 -8.11 -5.958c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6c-.21 .352 -.427 .688 -.647 1.008"/>
              <path d="M20 21l2 -2l-2 -2"/>
              <path d="M17 17l-2 2l2 2"/>
            </svg>
            预览
          </button>
        </div>
        <div v-show="showPreview"
             class="rounded-2xl block px-4 py-4 border-none focus:shadow-2xl dark:bg-neutral-900 bg-zinc-100 w-full resize-y min-h-[6rem] text-sm page-content"
             v-html="userComment ? md.render(userComment) : '先写点什么吧'">

        </div>

        <textarea
          id="comment_textarea"
          v-show="!showPreview"
          class="rounded-2xl block px-4 py-4 font-mono border-none focus:shadow-2xl dark:bg-neutral-900 bg-zinc-100 w-full resize-y min-h-[6rem] text-sm rounded-br-[6px]"
          required name="comment" placeholder="提些问题，或者打个招呼吧" v-model="userComment"></textarea>

        <div class="pt-2 text-xs dark:text-neutral-400 text-neutral-500 leading-5 ">
          评论系统基于 <a target="_blank" class="text-black dark:text-white" href="https://github.com/features/issues">GitHub
          Issues</a> 制作，发言请记得遵守 <a target="_blank" class="text-black dark:text-white"
                                            href="https://docs.github.com/zh/site-policy/github-terms/github-community-code-of-conduct">GitHub
          社区行为准则</a>。如果您比较好奇本博客是如何处理数据的，可以查看<a href="/privacy" class="text-black dark:text-white">隐私声明</a>。
        </div>

        <div class="text-center mt-2 flex justify-center">
          <button v-show="!sending_comment" type="submit"
                  class="rounded-full px-4 py-2 bg-neutral-800 text-white dark:bg-white dark:text-black text-sm flex items-center group">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="icon icon-tabler icon-tabler-send w-4 h-4 mr-2 top-0 group-hover:top-[-.2rem] relative transition-all"
                 viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M10 14l11 -11"/>
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"/>
            </svg>
            发送评论
          </button>
          <button v-show="sending_comment" disabled
                  class="rounded-full disabled:opacity-70 px-4 py-2 bg-neutral-800 text-white dark:bg-white dark:text-black text-sm flex items-center whitespace-nowrap"
                  type="button">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="icon icon-tabler icon-tabler-loader-2 animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24"
                 stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 3a9 9 0 1 0 9 9"/>
            </svg>
            发送评论
          </button>
        </div>
      </form>
    </section>

    <section data-name="loading screen" v-show="gettingComments" class="pt-8">
      <div class="flex text-sm justify-center items-center">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader-2 animate-spin" width="24"
               height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3a9 9 0 1 0 9 9"/>
          </svg>
        </div>
      </div>
    </section>

    <section data-name="comments" class="pt-8">
      <div class="text-center text-base font-black italic" v-show="!gettingComments">
        <span v-show="comments.length > 0">
          <span>{{ comments.length }}</span> 条评论
        </span>
        <span v-show="comments.length === 0" class="font-normal text-sm opacity-80 not-italic">
          目前还没有评论～
        </span>
      </div>
      <div v-show="comments.length > 0">
        <div class="comments-list">
          <div class="item pt-8 py-8" v-for="(item, i) in comments" :id="item.id" :key="item.id" :style="{
        opacity: deletingId === item.id ? '.3' : '1'
      }">
            <div class="datetime text-xs opacity-70">
              {{ dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
            <div class="user flex mt-2 w-full relative">
              <span class="outer-box flex justify-between w-full">
                <a :href="item.user.html_url" target="_blank" class="user-info flex items-center text-sm">
                  <img :src="item.user.avatar_url" alt="用户头像" class="w-8 h-8 rounded-full mb-0 mr-2">
                  <span class="flex items-center">
                    {{ item.user.login }}
                    <span class="author-tag px-2 text-xs rounded relative top-[-.5rem] left-[-.3rem] scale-75"
                          v-if="item.author_association === 'OWNER'">Author</span>
                  </span>
                </a>
                <span class="comment-actions flex-shrink-0" v-show="isUserLoggedIn && editingCommentId !== item.id">
                  <button
                    class="dark:bg-neutral-800 bg-neutral-200 rounded-full w-8 h-8 overflow-hidden flex items-center justify-center"
                    v-show="user.login === item.user.login" @click="toggleCommentActionDropdown(item.id)"
                    @mouseenter="mouseIsInActionWindow = true" @mouseleave="mouseIsInActionWindow = false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x w-4 h-4" :class="{
                      'hidden': commentActionDropdown !== item.id
                    }"
                         viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                         stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path
                      d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots w-4 h-4" :class="{
                      hidden: commentActionDropdown === item.id
                    }"
                         viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                         stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path
                      d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path
                      d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/></svg>
                  </button>
                  <button
                    class="h-[30px] leading-[28px] px-2 rounded-full bg-neutral-100 hover:bg-neutral-800 hover:text-white dark:bg-neutral-800 dark:text-white dark:hover:text-black dark:hover:bg-neutral-200 text-xs"
                    v-show="user.login !== item.user.login" @click="mention(item.user.login)"
                    role="button"><svg xmlns="http://www.w3.org/2000/svg"
                                       class="icon icon-tabler icon-tabler-at w-4 h-4" viewBox="0 0 24 24"
                                       stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                                       stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path
                    d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path
                    d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"/></svg></button>
                </span>
              </span>
              <div data-name="more actions"
                   class="absolute z-[500] top-[2.25rem] right-0 rounded-[1rem] dark:bg-neutral-800 px-2 py-2 bg-neutral-100 border-neutral-200 dark:border-neutral-700 border-[1px] shadow-xl"
                   style="animation: 0.15s ease 0s 1 normal none running slideUp;"
                   v-if="commentActionDropdown === item.id">
                <button
                  class="py-2 px-4 rounded-[.5rem] text-xs flex transition-all dark:hover:bg-white/10 hover:bg-black/10"
                  @click="editingCommentId = item.id; editingCommentContent = item.body">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit-circle w-4 h-4 mr-1"
                       viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                       stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z"/>
                    <path d="M16 5l3 3"/>
                    <path d="M9 7.07a7 7 0 0 0 1 13.93a7 7 0 0 0 6.929 -6"/>
                  </svg>
                  编辑
                </button>
                <button :disabled="deletingId === item.id"
                        @click="deleteComment(item.id)"
                        class="py-2 px-4 rounded-[.5rem] hover:bg-red-500 hover:text-white dark:bg-neutral-800 dark:text-white text-xs flex transition-all">
                  <svg v-show="deletingId !== item.id" xmlns="http://www.w3.org/2000/svg"
                       class="icon icon-tabler icon-tabler-trash w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2"
                       stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M4 7l16 0"/>
                    <path d="M10 11l0 6"/>
                    <path
                      d="M14 11l0 6"/>
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
                    <path
                      d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
                  </svg>
                  删除
                </button>
              </div>
            </div>
            <div class="mt-2 page-content comment-content" style="padding-bottom: 0"
                 v-html="md.render(item.body)" v-show="editingCommentId !== item.id"></div>
            <div class="mt-2" data-name="edit area" v-if="editingCommentId === item.id">
              <form action="javascript:" @submit="confirmEditing">
                <div>
                  <textarea
                    class="rounded-2xl block px-4 py-4 font-mono border-none focus:shadow-2xl dark:bg-neutral-900 bg-zinc-100 w-full resize-y min-h-[6rem] text-sm rounded-br-[6px]"
                    required v-model="editingCommentContent" id="comment_editing_textarea"></textarea>
                </div>
                <div class="mt-2 flex">
                  <button type="button" @click="editingCommentId = null; editingCommentContent = ''"
                          :disabled="submittingEditedComment"
                          class="rounded-full text-sm dark:bg-neutral-700 bg-neutral-200 px-4 py-2 flex items-center disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x w-4 h-4 mr-1"
                         viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                         stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M18 6l-12 12"/>
                      <path d="M6 6l12 12"/>
                    </svg>
                    取消
                  </button>
                  <button type="submit"
                          :disabled="submittingEditedComment"
                          class="rounded-full text-sm dark:bg-white dark:text-black bg-neutral-800 text-white px-4 py-2 flex items-center ml-2 disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         class="icon icon-tabler icon-tabler-loader-2 animate-spin w-4 h-4 mr-1" :class="{
                      'hidden': !submittingEditedComment,
                      'block': submittingEditedComment
                    }" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                         stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M12 3a9 9 0 1 0 9 9"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check w-4 h-4 mr-1"
                         :class="{
                      'hidden': submittingEditedComment,
                      'block': !submittingEditedComment
                    }" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                         stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M5 12l5 5l10 -10"/>
                    </svg>
                    确认编辑
                  </button>
                </div>
              </form>
            </div>
            <div class="mt-[-1rem] relative z-50 flex items-center" data-name="reactions"
                 v-show="editingCommentId !== item.id" :class="{
              'opacity-50 pointer-events-none': listingReactionCommentId === item.id
            }">
              <button v-for="button in reactionButtons" :title="button.means"
                      :disabled="reactingCommentID.includes(item.id)"
                      @click="makeReactionToComment(button.content, item.id)"
                      class="mr-1 disabled:opacity-50 text-xs flex items-center rounded-full px-2 py-1 max-h-[1.5rem] group text-indigo-800 dark:text-indigo-50 dark:bg-indigo-900 bg-indigo-50">
                <span class="transition-all mr-1 relative top-0 group-hover:text-2xl group-hover:top-[-.2rem]" :class="{
                  'text-2xl rotate-[-12deg] top-[-.2rem]': userHasReactedToComment(item.id, button.content)
                }">{{ button.label }}</span> {{
                  commentReactionMap[item.id] && commentReactionMap[item.id][button.content] ? commentReactionMap[item.id][button.content].length : 0
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import dayjs from 'dayjs'
import markdownit from 'markdown-it'

const md = markdownit({
  linkify: true
})

let originalTextParser = md.renderer.rules.text

// mention parser
md.renderer.rules.text = function (tokens, idx) {
  let text = tokens[idx].content
  let mentionRegex = /@([a-zA-Z0-9_-]+)/g

  if (mentionRegex.test(text)) {
    text = text.replace(mentionRegex, (match, username) => {
      return `<a href="https://github.com/${username}" target="_blank">@${username}</a>`
    })

    return text
  }

  return originalTextParser(tokens, idx)
}

const proxy = 'https://blog-api-cf-worker.jw1.dev/proxy'
let isUserLoggedIn = ref(false)
let user = ref({})
let userActionWindow = ref(false)
let mouseIsInsideWindow = ref(false)
let sending_comment = ref(false)
let showPreview = ref(false)
let owner = 'jw-12138'
let repo = 'jw-12138.github.io'
let auth_api = 'https://github.com/login/oauth/authorize'
let client_id = 'Iv1.717c117523f74671'
let authUrl = computed(() => {
  return `${auth_api}?client_id=${client_id}&redirect_uri=https://blog-api-cf-worker.jw1.dev/gh/cb?r=${location.href}`
})

let userComment = ref('')

let props = defineProps({
  githubIssueId: {
    type: Number,
    required: false
  }
})

let reactionButtons = [
  {
    label: '👍',
    content: '+1',
    means: 'agree!'
  },
  {
    label: '👎',
    content: '-1',
    means: 'disagree!'
  },
  {
    label: '❤️',
    content: 'heart',
    means: 'love it!'
  }
]

let accessToken = ref('')

let commentActionDropdown = ref('')
let mouseIsInActionWindow = ref(false)
let editingCommentId = ref(null)
let editingCommentContent = ref('')
let submittingEditedComment = ref(false)

async function confirmEditing() {
  let id = editingCommentId.value
  let content = editingCommentContent.value

  if (!id) {
    // reset
    editingCommentId.value = null
    editingCommentContent.value = ''
    return
  }

  if (!content) {
    alert('评论内容不能为空哦')
    return
  }

  if (submittingEditedComment.value) {
    return
  }

  let endpoint = `/repos/${owner}/${repo}/issues/comments/${id}`

  let resp

  try {
    submittingEditedComment.value = true
    resp = await githubApi(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({
        body: content
      })
    })
  } catch (e) {
    console.log(e)
    alert('编辑失败，再试一次？')
  } finally {
    submittingEditedComment.value = false
  }

  if (!resp.ok) {
    alert('编辑失败，再试一次？')
    return
  }

  if (resp.status === 200) {
    editingCommentId.value = null
    editingCommentContent.value = ''

    await getComments(id)
  }

}

function toggleCommentActionDropdown(id) {
  if (commentActionDropdown.value) {
    commentActionDropdown.value = ''
  } else {
    commentActionDropdown.value = id
  }
}

function goToUser() {
  location.href = user.value.html_url
}

let reactingCommentID = ref([])
let reactingIds = ref([])

let userHasReactedToComment = function (comment_id, reaction) {
  let username = user.value.login

  if (!commentReactionMap.value[comment_id]) {
    return null
  }

  if (!commentReactionMap.value[comment_id][reaction]) {
    return null
  }

  let reactions = commentReactionMap.value[comment_id][reaction]

  for (let i = 0; i < reactions.length; i++) {
    if (reactions[i].user.login === username) {
      return reactions[i].id
    }
  }
}

async function undoReactionToComment(comment_id, reaction_id, content) {
  let api = `/repos/${owner}/${repo}/issues/comments/${comment_id}/reactions/${reaction_id}`

  let resp
  try {
    reactingIds.value.push(reaction_id)
    resp = await githubApi(api, {
      method: 'DELETE'
    })
  } catch (e) {
    console.log(e)
    return
  } finally {
    reactingIds.value = reactingIds.value.filter(item => item !== reaction_id)
  }

  if (resp.ok) {
    comments.value = comments.value.map(item => {
      if (item.id === comment_id) {
        item.reactions[content]--
      }
      return item
    })

    // remove from commentReactionMap
    commentReactionMap.value[comment_id][content] = commentReactionMap.value[comment_id][content].filter(item => item.id !== reaction_id)
  } else {
    // well, something went wrong
  }
}

async function makeReactionToComment(reaction, comment_id) {

  if (!isUserLoggedIn.value) {
    alert('请先登录哦')
    return false
  }

  let reaction_id = userHasReactedToComment(comment_id, reaction)
  if (reaction_id) {
    reactingCommentID.value.push(comment_id)
    await undoReactionToComment(comment_id, reaction_id, reaction)
    reactingCommentID.value = reactingCommentID.value.filter(item => item !== comment_id)
    return false
  }

  let api = proxy + `/repos/${owner}/${repo}/issues/comments/${comment_id}/reactions`

  let resp

  try {
    reactingCommentID.value.push(comment_id)
    reactingIds.value.push(reaction_id)
    resp = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      },
      body: JSON.stringify({
        content: reaction
      })
    })
  } catch (e) {
    console.log(e)
    alert('点赞失败，请稍后再试')
    return
  } finally {
    reactingCommentID.value = reactingCommentID.value.filter(item => item !== comment_id)
    reactingIds.value = reactingIds.value.filter(item => item !== reaction_id)
  }

  if (resp.status === 200) {
    alert('已经点过赞啦，谢谢！')
    return
  }

  if (!resp.ok) {
    alert('点赞失败，请稍后再试')
    return
  }

  comments.value = comments.value.map(item => {
    if (item.id === comment_id) {
      item.reactions[reaction]++
    }
    return item
  })

  await listReactionsForComment(comment_id)
}

let commentReactionMap = ref({})
let listingReactionCommentId = ref(null)

async function listReactionsForComment(comment_id, retryLeft = 3) {

  if (retryLeft === 0) {
    return false
  }

  let api = `/repos/${owner}/${repo}/issues/comments/${comment_id}/reactions`

  let resp

  try {
    listingReactionCommentId.value = comment_id
    resp = await githubApi(api)
  } catch (e) {
    console.log(e)
    await listReactionsForComment(comment_id, retryLeft - 1)
    return
  } finally {
    listingReactionCommentId.value = null
  }

  if (!resp.ok) {
    console.log('获取评论点赞失败')
    await listReactionsForComment(comment_id, retryLeft - 1)
    return false
  }

  try {
    let reactions = await resp.json()

    let contentBasedReactions = {}

    reactions.forEach(item => {
      if (!contentBasedReactions[item.content]) {
        contentBasedReactions[item.content] = [item]
      } else {
        contentBasedReactions[item.content].push(item)
      }
    })

    commentReactionMap.value[comment_id] = contentBasedReactions
  } catch (e) {
    console.log(e)
    await listReactionsForComment(comment_id, retryLeft - 1)
    return false
  }
}

function login() {
  location.href = authUrl.value
}

function mention(username) {
  let space = ' '

  if (userComment.value[userComment.value.length - 1] === ' ' || userComment.value.length === 0) {
    space = ''
  }

  if (editingCommentId.value) {
    editingCommentContent.value += `${space}@${username} `
    document.getElementById('comment_editing_textarea').focus()
    return
  }

  userComment.value += `${space}@${username} `
  document.getElementById('comment_textarea').focus()
}

async function sendComment() {
  if (sending_comment.value) {
    return
  }

  sending_comment.value = true

  let resp

  try {
    resp = await githubApi(`/repos/${owner}/${repo}/issues/${props.githubIssueId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        body: userComment.value
      })
    })
  } catch (e) {
    console.log(e)
    alert('发送评论失败，请稍后再试')
  } finally {
    sending_comment.value = false
  }

  if (resp.ok) {
    userComment.value = ''
    await getComments()
  }
}

function logout() {
  let c = confirm('确定要退出登录吗？😯')
  if (!c) {
    return false
  }

  localStorage.clear()
  isUserLoggedIn.value = false
  user.value = {}
  sending_comment.value = false
  userActionWindow.value = false
  mouseIsInsideWindow.value = false

  reactingCommentID.value = []
  listingReactionCommentId.value = null
}

async function githubApi(endpoint, init = {}) {
  let headers = {
    'Accept': 'application/vnd.github+json',
    ...init.headers
  }

  if ((localStorage.getItem('access_token') && isUserLoggedIn.value) || endpoint === '/user') {
    headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')
  }

  let _init = {
    method: init.method || 'GET',
    headers
  }

  if (init.body) {
    _init.body = init.body
  }

  endpoint = endpoint + '?' + new URLSearchParams({
    t: Date.now()
  })

  return await fetch(proxy + endpoint, _init)
}

/**
 * 获取评论
 * @returns {Promise<void>}
 */
let comments = ref([])
let gettingComments = ref(false)

async function getComments(update_id) {props.githubIssueId

  if (gettingComments.value) {
    return
  }

  gettingComments.value = true
  let resp = await githubApi(`/repos/${owner}/${repo}/issues/${props.githubIssueId}/comments`)

  comments.value = await resp.json()
  gettingComments.value = false

  if (update_id) {
    listReactionsForComment(update_id)
    return false
  }

  for (let i = 0; i < comments.value.length; i++) {
    // don't go with await here
    listReactionsForComment(comments.value[i].id)
  }
}

let deletingId = ref(null)

async function deleteComment(id) {
  let c = confirm('确定要删除这条评论吗？😯')
  if (!c) {
    return
  }
  deletingId.value = id

  let resp

  try {
    resp = await githubApi(`/repos/${owner}/${repo}/issues/comments/${id}`, {
      method: 'DELETE'
    })
  } catch (e) {
    alert('删除失败，请稍后再试')
    console.log(e)
    return false
  } finally {
    deletingId.value = null
  }

  if (resp.ok) {
    comments.value = comments.value.filter(item => item.id !== id)
  }
}

/**
 * 检查登录状态
 */
let gettingUser = ref(false)

async function checkLogin() {
  accessToken.value = localStorage.getItem('access_token')

  if (!accessToken.value) {
    return
  }

  let resp

  try {
    gettingUser.value = true
    resp = await githubApi('/user')
  } catch (e) {
    console.log(e)
  } finally {
    gettingUser.value = false
  }

  if (!resp.ok) {
    return false
  }

  user.value = await resp.json()
  isUserLoggedIn.value = true
}

onMounted(async () => {
  let params = new URLSearchParams(document.location.search)
  let token = params.get('access_token')
  let type = params.get('token_type')
  if (token && type) {
    localStorage.setItem('access_token', token)
    localStorage.setItem('token_type', type)
    localStorage.setItem('token_timestamp', new Date() + '')
    location.href =
      location.protocol +
      '//' +
      location.host +
      location.pathname +
      '#comments'

    return
  }

  if (!props.githubIssueId) {
    return
  }

  window.addEventListener('click', function () {
    if (mouseIsInsideWindow.value === false) {
      userActionWindow.value = false
    }

    if (mouseIsInActionWindow.value === false) {
      commentActionDropdown.value = false
    }
  })

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (userActionWindow.value) {
        userActionWindow.value = false
      }

      if (commentActionDropdown.value) {
        commentActionDropdown.value = false
      }
    }
  })

  await checkLogin()
  await getComments()
})
</script>
