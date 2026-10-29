// Below are built-in components that are available in the app, it's recommended to keep them as is
import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';


import { BYOCWrapper, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in import section
import * as Title from 'src/components/title/Title';
import * as ThemeEditor from 'src/components/theme-editor/ThemeEditor';
import * as SocialFollow from 'src/components/social-follow/SocialFollow';
import * as SelectedArticles from 'src/components/selected-articles/SelectedArticles';
import * as SectionWrapper from 'src/components/section-wrapper/SectionWrapper';
import * as SearchResults from 'src/components/search-results/SearchResults';
import * as RowSplitter from 'src/components/row-splitter/RowSplitter';
import * as RichText from 'src/components/rich-text/RichText';
import * as Promo from 'src/components/promo/Promo';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/page-content/PageContent';
import * as SuggestionBlock from 'src/components/non-sitecore/search/SuggestionBlock';
import * as Spinner from 'src/components/non-sitecore/search/Spinner';
import * as SortOrder from 'src/components/non-sitecore/search/SortOrder';
import * as SearchResultsComponent from 'src/components/non-sitecore/search/SearchResultsComponent';
import * as SearchPagination from 'src/components/non-sitecore/search/SearchPagination';
import * as SearchFacets from 'src/components/non-sitecore/search/SearchFacets';
import * as ResultsPerPage from 'src/components/non-sitecore/search/ResultsPerPage';
import * as QuestionsAnswers from 'src/components/non-sitecore/search/QuestionsAnswers';
import * as QueryResultsSummary from 'src/components/non-sitecore/search/QueryResultsSummary';
import * as PreviewSearch from 'src/components/non-sitecore/search/PreviewSearch';
import * as HomeHighlighted from 'src/components/non-sitecore/search/HomeHighlighted';
import * as CardViewSwitcher from 'src/components/non-sitecore/search/CardViewSwitcher';
import * as ArticleHorizontalCard from 'src/components/non-sitecore/search/ArticleHorizontalCard';
import * as ArticleCard from 'src/components/non-sitecore/search/ArticleCard';
import * as Navigation from 'src/components/navigation/Navigation';
import * as Masdr2Testimonials from 'src/components/masdr2/Masdr2Testimonials';
import * as Masdr2Solutions from 'src/components/masdr2/Masdr2Solutions';
import * as Masdr2News from 'src/components/masdr2/Masdr2News';
import * as Masdr2LogoStrip from 'src/components/masdr2/Masdr2LogoStrip';
import * as Masdr2Impact from 'src/components/masdr2/Masdr2Impact';
import * as Masdr2Hero from 'src/components/masdr2/Masdr2Hero';
import * as Masdr2Header from 'src/components/masdr2/Masdr2Header';
import * as Masdr2Footer from 'src/components/masdr2/Masdr2Footer';
import * as Masdr2Cta from 'src/components/masdr2/Masdr2Cta';
import * as MasdarTestimonials from 'src/components/masdar/MasdarTestimonials';
import * as MasdarSolutions from 'src/components/masdar/MasdarSolutions';
import * as MasdarNews from 'src/components/masdar/MasdarNews';
import * as MasdarLogoStrip from 'src/components/masdar/MasdarLogoStrip';
import * as MasdarImpact from 'src/components/masdar/MasdarImpact';
import * as MasdarHero from 'src/components/masdar/MasdarHero';
import * as MasdarHeader from 'src/components/masdar/MasdarHeader';
import * as MasdarFooter from 'src/components/masdar/MasdarFooter';
import * as MasdarCta from 'src/components/masdar/MasdarCta';
import * as LinkList from 'src/components/link-list/LinkList';
import * as Image from 'src/components/image/Image';
import * as HeroBanner from 'src/components/hero-banner/HeroBanner';
import * as Header from 'src/components/header/Header';
import * as GridStatusGauge from 'src/components/gridstatusgauge/GridStatusGauge';
import * as GridChartData from 'src/components/grid-demand/gridChartData';
import * as GridDemand from 'src/components/grid-demand/GridDemand';
import * as GridData from 'src/components/grid-conditions/gridData';
import * as GridConditions from 'src/components/grid-conditions/GridConditions';
import * as Footer from 'src/components/footer/Footer';
import * as Features from 'src/components/features/Features';
import * as Example2Privileges from 'src/components/example2/Example2Privileges';
import * as Example2HeroGrid from 'src/components/example2/Example2HeroGrid';
import * as Example2HelpContact from 'src/components/example2/Example2HelpContact';
import * as Example2Header from 'src/components/example2/Example2Header';
import * as Example2Footer from 'src/components/example2/Example2Footer';
import * as Example2CardShowcase from 'src/components/example2/Example2CardShowcase';
import * as Example2AppPromo from 'src/components/example2/Example2AppPromo';
import * as ContentBlock from 'src/components/content-block/ContentBlock';
import * as Container from 'src/components/container/Container';
import * as ColumnSplitter from 'src/components/column-splitter/ColumnSplitter';
import * as ArticleListing from 'src/components/article-listing/ArticleListing';
import * as ArticleDetails from 'src/components/article-details/ArticleDetails';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['Title', { ...Title }],
  ['ThemeEditor', { ...ThemeEditor }],
  ['SocialFollow', { ...SocialFollow }],
  ['SelectedArticles', { ...SelectedArticles }],
  ['SectionWrapper', { ...SectionWrapper }],
  ['SearchResults', { ...SearchResults }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent }],
  ['SuggestionBlock', { ...SuggestionBlock }],
  ['Spinner', { ...Spinner }],
  ['SortOrder', { ...SortOrder }],
  ['SearchResultsComponent', { ...SearchResultsComponent }],
  ['SearchPagination', { ...SearchPagination }],
  ['SearchFacets', { ...SearchFacets }],
  ['ResultsPerPage', { ...ResultsPerPage }],
  ['QuestionsAnswers', { ...QuestionsAnswers }],
  ['QueryResultsSummary', { ...QueryResultsSummary }],
  ['PreviewSearch', { ...PreviewSearch }],
  ['HomeHighlighted', { ...HomeHighlighted }],
  ['CardViewSwitcher', { ...CardViewSwitcher }],
  ['ArticleHorizontalCard', { ...ArticleHorizontalCard }],
  ['ArticleCard', { ...ArticleCard }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['Masdr2Testimonials', { ...Masdr2Testimonials }],
  ['Masdr2Solutions', { ...Masdr2Solutions }],
  ['Masdr2News', { ...Masdr2News }],
  ['Masdr2LogoStrip', { ...Masdr2LogoStrip }],
  ['Masdr2Impact', { ...Masdr2Impact }],
  ['Masdr2Hero', { ...Masdr2Hero }],
  ['Masdr2Header', { ...Masdr2Header, componentType: 'client' }],
  ['Masdr2Footer', { ...Masdr2Footer }],
  ['Masdr2Cta', { ...Masdr2Cta }],
  ['MasdarTestimonials', { ...MasdarTestimonials }],
  ['MasdarSolutions', { ...MasdarSolutions }],
  ['MasdarNews', { ...MasdarNews }],
  ['MasdarLogoStrip', { ...MasdarLogoStrip }],
  ['MasdarImpact', { ...MasdarImpact }],
  ['MasdarHero', { ...MasdarHero }],
  ['MasdarHeader', { ...MasdarHeader, componentType: 'client' }],
  ['MasdarFooter', { ...MasdarFooter }],
  ['MasdarCta', { ...MasdarCta }],
  ['LinkList', { ...LinkList }],
  ['Image', { ...Image }],
  ['HeroBanner', { ...HeroBanner }],
  ['Header', { ...Header, componentType: 'client' }],
  ['GridStatusGauge', { ...GridStatusGauge }],
  ['gridChartData', { ...GridChartData }],
  ['GridDemand', { ...GridDemand }],
  ['gridData', { ...GridData }],
  ['GridConditions', { ...GridConditions }],
  ['Footer', { ...Footer }],
  ['Features', { ...Features, componentType: 'client' }],
  ['Example2Privileges', { ...Example2Privileges }],
  ['Example2HeroGrid', { ...Example2HeroGrid, componentType: 'client' }],
  ['Example2HelpContact', { ...Example2HelpContact }],
  ['Example2Header', { ...Example2Header, componentType: 'client' }],
  ['Example2Footer', { ...Example2Footer }],
  ['Example2CardShowcase', { ...Example2CardShowcase }],
  ['Example2AppPromo', { ...Example2AppPromo }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['ArticleListing', { ...ArticleListing }],
  ['ArticleDetails', { ...ArticleDetails }],
]);

export default componentMap;
