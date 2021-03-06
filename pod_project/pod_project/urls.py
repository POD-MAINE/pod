from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import RedirectView
from django.contrib import admin
admin.autodiscover()

from haystack.query import SearchQuerySet
from haystack.views import SearchView, search_view_factory, FacetedSearchView
from pods.forms import DateRangeSearchForm
sqs = SearchQuerySet().facet('owner').facet('type').facet(
    'tags').facet('discipline').facet('channel')

urlpatterns = patterns(
    '',
    (r'^favicon\.ico$', RedirectView.as_view(url=settings.STATIC_URL+settings.TEMPLATE_THEME+'/images/favicon.ico')),
    (r'^i18n/', include('django.conf.urls.i18n')),
    url(r'^admin/', include(admin.site.urls)),
    # ACCOUNT
    url(r'^accounts/login/$', 'core.views.core_login', name='account_login'),
    url(r'^accounts/logout/$', 'core.views.core_logout',
        name='account_logout'),
    url(r'^accounts/cas/login/$',
        'django_cas_gateway.views.login', name='cas_login'),
    url(r'^accounts/cas/logout/$',
        'django_cas_gateway.views.logout', name='cas_logout'),
    url(r'^user/', 'core.views.user_profile', name='user_profile'),

    url(r'^owner_channels_list/', 'pods.views.owner_channels_list',
        name='owner_channels_list'),
    url(r'^owner_videos_list/', 'pods.views.owner_videos_list',
        name='owner_videos_list'),
    url(r'^favorites_videos_list/', 'pods.views.favorites_videos_list',
        name='favorites_videos_list'),
    # TEXT EDITOR
    url(r'^ckeditor/', include('ckeditor.urls')),
    url(r'^browse/', 'core.views.file_browse', name='ckeditor_browse'),
    # Add for no staff users
    (r'^dynamic-media/jsi18n/$', 'django.views.i18n.javascript_catalog'),
    (
        r'^my-admin/jsi18n/',
        'django.views.i18n.javascript_catalog',
        {'packages': ('django.conf', 'django.contrib.admin')}
    ),

    url(
        r'^search/$',
        search_view_factory(
            view_class=FacetedSearchView,
            template='search/search.html',
            searchqueryset=sqs,
            form_class=DateRangeSearchForm
        ),
        name='haystack_search'
    ),
    url(r'^search/autocomplete/$',
        'pods.views.autocomplete', name='autocomplete'),

    # MEDIACOURSES
    url(r'^mediacourses_add/$',
        'pods.views.mediacourses', name="mediacourses"),
    url(r'^mediacourses_notify/$',
        'pods.views.mediacourses_notify', name="mediacourses_notify"),
    url(r'^lives/$', 'pods.views.lives', name="lives"),
    # Warning do not modify for the recorder
    url(r'^liveState/$', 'pods.views.liveState', name="liveState"),
    url(r'^liveSlide/$', 'pods.views.liveSlide', name="liveSlide"),
    url(r'^live/(?P<pk>\d+)/$', 'pods.views.live', name="live"),

    # POD VIDEOS
    url(r'^owners/$', 'pods.views.owners', name='owners'),
    url(r'^types/$', 'pods.views.types', name='types'),
    url(r'^disciplines/$', 'pods.views.disciplines', name='disciplines'),
    url(r'^tags/$', 'pods.views.tags', name='tags'),
    url(r'^videos/$', 'pods.views.videos', name='videos'),
    url(r'^video/(?P<slug>[\-\d\w]+)/$', 'pods.views.video', name='video'),
    url(r'^video_edit/$', 'pods.views.video_edit', name='video_edit'),
    url(r'^video_edit/(?P<slug>[\-\d\w]+)/$',
        'pods.views.video_edit', name='video_edit'),
    url(r'^video_delete/(?P<slug>[\-\d\w]+)/$',
        'pods.views.video_delete', name='video_delete'),
    url(r'^video_add_favorite/(?P<slug>[\-\d\w]+)/$',
        'pods.views.video_add_favorite', name='video_add_favorite'),
    url(r'^video_completion/(?P<slug>[\-\d\w]+)/$',
        'pods.views.video_completion', name='video_completion'),
    url(r'^video_chapter/(?P<slug>[\-\d\w]+)/$',
        'pods.views.video_chapter', name='video_chapter'),
    url(r'^video_enrich/(?P<slug>[\-\d\w]+)/$',
        'pods.views.video_enrich', name='video_enrich'),
    url(r'^video_notes/(?P<slug>[\-\d\w]+)/$',
        'pods.views.video_notes', name='video_notes'),
    url(
        r'^get_video_encoding/(?P<slug>[\-\d\w]+)/(?P<csrftoken>[\-\d\w]+)/(?P<size>[\-\d]+)/(?P<type>[\-\d\w]+)/(?P<ext>[\-\d\w]+)/$',
        'pods.views.get_video_encoding',
        name='get_video_encoding'
    ),
    # Channel
    url(r'^channels/$', 'pods.views.channels', name='channels'),
    url(r'^(?P<slug_c>[\-\d\w]+)/$', 'pods.views.channel', name='channel'),
    url(r'^(?P<slug_c>[\-\d\w]+)/edit$',
        'pods.views.channel_edit', name='channel_edit'),
    url(r'^(?P<slug_c>[\-\d\w]+)/(?P<slug_t>[\-\d\w]+)/$',
        'pods.views.channel', name='theme'),
    url(r'^(?P<slug_c>[\-\d\w]+)/video/(?P<slug>[\-\d\w]+)/$',
        'pods.views.video', name='video'),
    url(r'^(?P<slug_c>[\-\d\w]+)/(?P<slug_t>[\-\d\w]+)/video/(?P<slug>[\-\d\w]+)/$',
        'pods.views.video', name='video'),

) + \
    static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + \
    static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
